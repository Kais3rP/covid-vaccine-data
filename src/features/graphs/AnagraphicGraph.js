import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Header from "../../components/reusable/Header";
import HtmlTooltip from "../../components/reusable/HtmlTooltip";
import BadgeTextGraph from "./BadgeTextGraph";
import { useAnagraphicData } from "./hooks";
import { useCallback, useMemo, useState } from "react";
import Zoom from "@mui/material/Zoom";
import { useWidth } from "../../hooks";
import { barColors } from "../../data";
import Map from "../italymap/Map";
import Spinner from "../../components/reusable/Spinner";

const AnagraphicGraph = () => {
  const [ageRangeSelected, setAgeRangeSelected] = useState(null);
  const currentRegion = useSelector((state) => state.map.region);

  const { data, isLoading } = useAnagraphicData();

  const computedData = useMemo(() => {
    if (!data.data) return null;

    return currentRegion && currentRegion?.type === "age"
      ? { ...data, data: data.data[currentRegion.id] }
      : { ...data, data: data.data.Total };
  }, [data, currentRegion]);

  const totalNumber = useMemo(() => {
    if (!computedData) return 0;
    if (ageRangeSelected)
      return computedData.data
        .find((el) => el.eta === ageRangeSelected.range)
        [ageRangeSelected.type.key].toLocaleString("en-US");
    else
      return computedData.data
        .reduce((sum, curr) => sum + curr.totale, 0)
        .toLocaleString("en-US");
  }, [computedData, ageRangeSelected]);

  const legendData = computedData?.doseTypes.reduce((obj, el, i) => {
    obj[el.label] = barColors[i];
    return obj;
  }, {});

  const handleRectClick = useCallback(
    (el, type, idx) => {
      if (
        ageRangeSelected &&
        ageRangeSelected.type.key === type.key &&
        ageRangeSelected.range === el.eta
      )
        setAgeRangeSelected(null);
      else setAgeRangeSelected({ range: el.eta, type, idx });
    },
    [ageRangeSelected]
  );

  return isLoading || !computedData ? (
    <Spinner isLoading={isLoading || !computedData} />
  ) : (
    <Box>
      <Header title={"Administrations following age ranges"} />
      <BadgeTextGraph
        title={`Total administrations - ${
          currentRegion && currentRegion.type === "age"
            ? currentRegion.id
            : "Italy"
        } - ${
          ageRangeSelected
            ? ageRangeSelected.range + " " + ageRangeSelected.type.label
            : "Total"
        }`}
        data={totalNumber}
        badgePosition={"left"}
      />
      <Grid container sx={{ mt: 3, display: "flex" }}>
        <Grid item xs={12} md={6}>
          <Graph
            data={computedData}
            onClick={handleRectClick}
            ageRangeSelected={ageRangeSelected}
            isRegionSelected={currentRegion && currentRegion.type === "age"}
          />
          <Legend data={legendData} isDark />
          <Typography color={"primary"}>
            *Pass with mouse over the bars to show tooltip info. Click on bars
            to show all the details.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Map type={"age"} deselectOnBlur={false} />
        </Grid>
      </Grid>
    </Box>
  );
};

const Graph = ({ data, onClick, ageRangeSelected, isRegionSelected }) => {
  const { width, ref } = useWidth();
  const barWidth = 45;
  const height = 500;

  return (
    <Box sx={{ position: "relative" }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="anagraphic-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g>
          {data?.data.map((el, i) => (
            <g key={el.eta}>
              {data?.doseTypes.map((type, j) => (
                <HtmlTooltip
                  key={type.key}
                  TransitionComponent={Zoom}
                  followCursor={true}
                  title={
                    <BarTooltip
                      data={{
                        type: type.label,
                        value: el[type.key]?.toLocaleString("en-US"),
                        ageRange: el.eta,
                        percentage: ((el[type.key] * 100) / el.people).toFixed(
                          1
                        ),
                        total: el.people?.toLocaleString("it"),
                        isTotal: type.key === "people",
                      }}
                    />
                  }
                >
                  <rect
                    // onMouseEnter={(e) => onMouseEnter(type)}
                    onClick={() => onClick(el, type, i)}
                    className="bar"
                    height={barWidth}
                    width={formatData(
                      el[type.key],
                      width,
                      data?.data.reduce(
                        (acc, curr) => (curr.people > acc ? curr.people : acc),
                        0
                      )
                    )} // pick the higher total people number as reference for max width
                    fill={
                      ageRangeSelected?.range === el.eta &&
                      ageRangeSelected?.type.key === type.key
                        ? "#dfd"
                        : barColors[j]
                    }
                    x={
                      0 // 100 is the label offset
                    }
                    y={i * (barWidth + 2)}
                  />
                </HtmlTooltip>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default AnagraphicGraph;

const BarTooltip = ({ data }) => {
  return (
    <>
      {" "}
      <Typography color="inherit">{`Age range: ${data.ageRange}`}</Typography>
      <Typography color="inherit">{data.type}</Typography>
      <Typography color="inherit">{data.value}</Typography>
      {!data.isTotal && (
        <Typography color="inherit">{`(${data.percentage})%`}</Typography>
      )}
      {!data.isTotal && (
        <Typography color="inherit">
          {`Vaccinated ${data.value} on a total of ${data.total} people`}
        </Typography>
      )}
    </>
  );
};

const Legend = ({ data, isDark }) => {
  return data ? (
    <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
      {Object.entries(data).map((el) => (
        <Box key={el[0]} sx={{ display: "flex", mb: 1, mr: 2 }}>
          <Box
            sx={{
              mr: 1,
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: el[1],
            }}
          />

          <Typography color={isDark ? "primary" : "secondary"} variant="h7">
            {el[0]}
          </Typography>
        </Box>
      ))}
    </Box>
  ) : null;
};

const formatData = (value, width, total) => {
  return Math.abs((width * value) / total) || 0;
};
