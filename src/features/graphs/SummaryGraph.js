import { Box, Container, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../components/reusable/Spinner";
import Map from "../italymap/Map";
import { useSummaryData } from "./hooks";
import List from "./List";

const SummaryGraph = () => {
  let { data, isLoading, isSuccess } = useSummaryData();
  const currentRegion = useSelector((state) => state.map.region);
  const summaryData = useMemo(() => {
    return currentRegion && currentRegion.type === "summary"
      ? {
          columns: data.columns,
          rows: data.rows.filter((el) => el.region === currentRegion.id),
        }
      : data;
  }, [currentRegion, data]);

  return isLoading || isSuccess ? (
    <Spinner isLoading={isLoading || !summaryData} />
  ) : (
    <Box sx={{ mt: 3 }}>
      {" "}
      <Typography color={"text.secondary"} variant={"h5"} align={"center"}>
        Total administrated compared to delivered doses{" "}
      </Typography>{" "}
      <Grid container sx={{ mt: 3, display: "flex" }}>
        <Grid item xs={12} md={6}>
          {" "}
          <List data={summaryData} />
        </Grid>
        <Grid item xs={12} md={6}>
          {" "}
          <Map
            type={"summary"}
            data={
              currentRegion
                ? summaryData?.rows[0]?.administered
                : summaryData?.rows[summaryData.rows.length - 1]?.administered
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryGraph;
