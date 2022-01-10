import { Box, Container, Grid, Slider, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  obj[el] = barColors[i];
  return obj;
}, {});

const WeeklyGraph = () => {
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
              <Graph />
            </Box>
            <Typography variant={"h7"} align={"center"}>
              *Move selectors to zoom left and right
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeeklyGraph;

const Graph = () => {
  const { width, ref } = useWidth();
  const [zoom, setZoom] = useState([0, 100]);
  const [isZoomingLeft, setIsZoomingLeft] = useState(false);
  const _zoom = 100 - (zoom[1] - zoom[0]);
  const barWidth = 8;
  const height = 500;
  const barMargin = 52;
  const leftCounterMargin = -_zoom * 45;
  const { data, isLoading } = useAdministeredData();
  const margin = 100; /* (width - data?.data?.length * (barWidth + 2)) / 2 - 4 */
  console.log("ADMINISTERED ACTUAL WEEKLY", data);
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
        viewBox={"0 140 680 350"}
      >
        <g transform={`translate(${margin} 0)`}>
          {data?.data.map((el, i) =>
            data.brands.map((brand, j) => (
              <HtmlTooltip
                key={brand}
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: brand,
                        value: el[1][brand],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth + _zoom}
                  height={formatData(el[1][data.brands[j]])}
                  fill={barColors[j]}
                  x={
                    isZoomingLeft
                      ? leftCounterMargin + i * (barWidth + 2 + _zoom)
                      : i * (barWidth + 2 + _zoom)
                  }
                  y={
                    height -
                    barMargin -
                    formatData(el[1][data.brands[j]]) -
                    formatData(el[1][data.brands[j + 1]] || 0)
                  }
                />
              </HtmlTooltip>
            ))
          )}
        </g>

        <DateAxis
          data={data?.data}
          containerWidth={width}
          containerHeight={height}
          zoom={_zoom}
          isZoomingLeft={isZoomingLeft}
          leftCounterMargin={leftCounterMargin}
          margin={margin}
        />
      </svg>
      <Container>
        <Slider
          getAriaLabel={() => "Zoom range"}
          value={zoom}
          onChange={debounce((e, val, active) => {
            setIsZoomingLeft(active === 1);
            setZoom(val);
          }, 2)}
          valueLabelDisplay="auto"
          getAriaValueText={(val) => val}
          color="secondary"
        />
      </Container>
    </Box>
  );
};

const BarTooltip = ({ data }) => {
  console.log("BRAND", data);
  return (
    <>
      {" "}
      <Typography color="inherit">
        {data.data.brand === "Pfizer Pediatrico"
          ? "Pediatric Pfizer"
          : data.data.brand}
      </Typography>
      <Typography color="inherit">
        {data.data.value.toLocaleString("en-US")}
      </Typography>
      <Typography color="inherit">{`from ${format(
        new Date(data?.dateRange[0]),
        "dd/MM"
      )} to ${format(new Date(data?.dateRange[1]), "dd/MM")}`}</Typography>
    </>
  );
};

const Legend = ({ data }) => {
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

          <Typography variant="h7">
            {el[0] === "Pfizer Pediatrico" ? "Pediatric Pfizer" : el[0]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const formatData = (value) => value / 10000;
const formatRange = (date) => [
  date,
  new Date(new Date(date).setDate(new Date(date).getDate() + 7)).toISOString(),
];
