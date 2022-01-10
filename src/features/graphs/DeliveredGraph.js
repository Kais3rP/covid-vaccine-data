import { Box, Container, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Header from "../../components/reusable/Header";
import BadgeTextGraph from "./BadgeTextGraph";
import {
  useAnagraphicData,
  useSuppliedData,
  useTotalAdministrations,
  useTotalDelivered,
} from "./hooks";
import HtmlTooltip from "../../components/reusable/HtmlTooltip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useAdministeredData } from "./hooks";
import Zoom from "@mui/material/Zoom";
import people from "../../img/group_person.svg";
import { useWidth } from "../../hooks";
import { format } from "date-fns";
import { barColors } from "../../data";
import { SignalCellularNullRounded } from "@mui/icons-material";
import {
  RandomAxis,
  RandomAxisHorizontal,
} from "../../components/reusable/Axis";

const DeliveredGraph = () => {
  const { data, isLoading } = useSuppliedData();
  console.log("DELIBVERED", data);
  const [supplierSelected, setSupplierSelected] = useState(null);
  const onClick = (data) => {
    setSupplierSelected((d) => (d && d[0] === data[0] ? null : data));
  };

  return isLoading ? (
    "Loading..."
  ) : (
    <Box>
      <Header title={"Supplier distribution"} />
      <BadgeTextGraph
        title={"Total vaccines delivered"}
        data={
          supplierSelected
            ? `${supplierSelected[0]} - ${supplierSelected[1].toLocaleString(
                "en-US"
              )}`
            : data?.data
                .find((el) => el[0] === "total")[1]
                .toLocaleString("en-US")
        }
        badgePosition={"right"}
      />
      <Graph
        data={data}
        onClick={onClick}
        supplierSelected={supplierSelected}
      />
    </Box>
  );
};

export default DeliveredGraph;

const Graph = ({ data, onClick, supplierSelected }) => {
  const { width, ref } = useWidth();
  const barWidth = 70;
  const height = 800;
  const barMargin = 100;

  const leftCounterMargin = 0;
  const barXMargin = 70;
  const margin = 150; /* (width - (barXMargin + barWidth) * data?.data.length) / 2 */
  return (
    <Box sx={{ position: "relative" }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="suppliers-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={"0 420 800 350"}
      >
        <g transform={`translate(${margin} 0)`}>
          {data?.data
            .filter((el) => el[0] !== "total")
            .map((el, i) => (
              <g key={el[0]}>
                <HtmlTooltip
                  TransitionComponent={Zoom}
                  followCursor={true}
                  title={
                    <BarTooltip
                      data={{
                        type: el[0],
                        value: el[1].toLocaleString("en-US"),
                      }}
                    />
                  }
                >
                  <rect
                    onClick={() => onClick(el)}
                    className="bar"
                    width={barWidth}
                    height={formatData(el[1])}
                    fill={
                      supplierSelected && supplierSelected[0] === el[0]
                        ? "#F00"
                        : barColors[i]
                    }
                    x={i * (barWidth + barXMargin)}
                    y={height - barMargin - formatData(el[1])}
                  />
                </HtmlTooltip>
                <text
                  x={i * (barWidth + barXMargin) - 5}
                  y={height - barMargin - formatData(el[1]) - 10}
                >
                  {el[1].toLocaleString("en-US")}
                </text>
              </g>
            ))}
        </g>
        <RandomAxisHorizontal
          data={data?.brands.map((el) => el.label)}
          containerWidth={width}
          containerHeight={height}
          leftCounterMargin={leftCounterMargin}
          xGap={barWidth + barXMargin}
          margin={margin}
        />
      </svg>
    </Box>
  );
};

const BarTooltip = ({ data }) => {
  console.log("TOOLTIP DATA", data, data.isTotal);
  return (
    <>
      {" "}
      <Typography color="inherit">{data.type}</Typography>
      <Typography color="inherit">{data.value}</Typography>
    </>
  );
};

const Legend = ({ data }) => {
  console.log("LEGEND", Object.entries(data));
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
};

const formatData = (value) => value / 200000;
