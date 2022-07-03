import { Box, Container, Grid, Slider, Typography } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash.debounce";
import { useAdministeredData } from "./hooks";
import Zoom from "@mui/material/Zoom";
import Header from "../../components/reusable/Header";
import people from "../../img/group_person.svg";
import { Badge } from "../../components/reusable/Badge";
import { DateAxis } from "../../components/reusable/Axis";
import { useWidth } from "../../hooks";
import { format } from "date-fns";
import HtmlTooltip from "../../components/reusable/HtmlTooltip";
import { brands, barColors } from "../../data";

const legendData = brands.reduce((obj, el, i) => {
  obj[el.label] = barColors[i];
  return obj;
}, {});

const WeeklyGraph = () => {
  const { data, isLoading } = useAdministeredData();

  return (
    <Box>
      <Header title={"Administrations weekly trend"} />

      <Grid
        container
        sx={{
          backgroundColor: "primary.main",
          pt: 2,
          pb: 2,
          mt: 2,
          display: "flex",
        }}
      >
        <Grid item xs={12} md={3}>
          <Box sx={{ m: 2 }}>
            <Badge src={people} alt="people" width={10} />
            <Legend data={legendData} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: "flex",
          }}
        >
          <Container
            sx={{
              m: 2,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {" "}
            <Typography variant={"h7"} align={"center"}>
              *Pass with mouse on the graph bars to show the weekly data
            </Typography>
            <Box>
              <Graph data={data} isLoading={isLoading} />
            </Box>
            <Box sx={{ mx: "auto", mt: 2 }}>
              <Typography variant={"h7"} align={"center"}>
                *Move selectors to zoom left and right
              </Typography>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeeklyGraph;

const Graph = React.memo(({ data, isLoading }) => {
  const { width, ref } = useWidth();
  const [zoom, setZoom] = useState([0, 100]);
  const height = 800;

  const barsData = useMemo(() => {
    if (!data?.data) return [];
    const ratio = data.data.length / 100;
    const startN = zoom[0] * ratio;
    const endN = (100 - zoom[1]) * ratio;
    return [...data.data.slice(startN, data.data.length - endN)];
  }, [data, zoom]);

  const barWidth = useMemo(() => {
    return width / barsData.length - 2;
  }, [width, barsData]);

  return isLoading ? (
    "Loading..."
  ) : (
    <Box sx={{ position: "relative" }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="week-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <Bars
          brandsData={data?.brands}
          barsData={barsData}
          height={height}
          barWidth={barWidth}
        />
      </svg>
      <Container>
        <Slider
          getAriaLabel={() => "Zoom range"}
          value={zoom}
          onChange={debounce((e, val, active) => {
            setZoom(val);
          }, 5)}
          valueLabelDisplay="auto"
          getAriaValueText={(val) => val}
          color="secondary"
        />
      </Container>
    </Box>
  );
});

const Bars = React.memo(
  ({ barsData, brandsData, height, margin, barWidth }) => {
    console.log("BARS DATA", barsData);
    const barMargin = 1;
    return (
      <g>
        {barsData.map((el, i) => (
          <g>
            {brandsData.map((brand, j) => (
              <HtmlTooltip
                key={brand.key}
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: brand.label,
                        value: el[1][brand.key],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth}
                  height={formatData(el[1][brandsData[j].key])}
                  fill={barColors[j]}
                  x={i * (barWidth + 2)}
                  y={
                    height -
                    barMargin -
                    formatData(el[1][brandsData[j]?.key]) -
                    formatData(el[1][brandsData[j + 1]?.key] || 0) -
                    40 // space for date
                  }
                />
              </HtmlTooltip>
            ))}
            <text
              style={{
                font: `lighter ${barWidth * 0.06}rem sans-serif`,
                fill: "#DDD",
              }}
              x={i * (barWidth + 2) - 35} //30 is the offset on the y axis since it's rotated x is y and y is x axis
              y={height}
              transform={`rotate(90,${i * (barWidth + 2)},${height})`}
            >
              {format(new Date(el[0]), "dd/MM")}
            </text>
          </g>
        ))}
      </g>
    );
  }
);

const BarTooltip = React.memo(({ data }) => {
  return (
    <>
      {" "}
      <Typography color="inherit">
        {data.data.brand === "Pfizer Pediatrico"
          ? "Pediatric Pfizer"
          : data.data.brand}
      </Typography>
      <Typography color="inherit">
        {data.data.value.toLocaleString("it")}
      </Typography>
      <Typography color="inherit">{`from ${format(
        new Date(data?.dateRange[0]),
        "dd/MM"
      )} to ${format(new Date(data?.dateRange[1]), "dd/MM")}`}</Typography>
    </>
  );
});

const Legend = React.memo(({ data }) => {
  return (
    <Box sx={{ mt: 3 }}>
      {Object.entries(data).map((el) => (
        <Box key={el[0]} sx={{ display: "flex", mb: 1 }}>
          <Box
            sx={{
              mr: 2,
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: el[1],
            }}
          />

          <Typography variant="h7">{el[0]}</Typography>
        </Box>
      ))}
    </Box>
  );
});

const formatData = (value) => value / 5000;
const formatRange = (date) => [
  date,
  new Date(new Date(date).setDate(new Date(date).getDate() + 7)).toISOString(),
];
