import { Box, Container, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/reusable/Header";
import { useGetAdministrationSitesQuery } from "../../services";
import Map from "../italymap/Map";
import BadgeTextGraph from "./BadgeTextGraph";
import { useAdministrationSitesData, useSummaryData } from "./hooks";
import List from "./List";

const AdministrationSites = () => {
  let { data, isLoading, isSuccess } = useAdministrationSitesData();
  const currentRegion = useSelector((state) => state.map.region);

  return isLoading || !isSuccess ? (
    "Loading..."
  ) : (
    <Box sx={{ mt: 3 }}>
      <Header
        title={"Main administration sites"}
        sub={" (Included hospitals, temporary sites not included)"}
      />
      <BadgeTextGraph
        title={`Total: 
  ${
    currentRegion && currentRegion.type === "site" ? currentRegion.id : "Italy"
  }`}
        data={
          currentRegion && currentRegion.type === "site"
            ? data?.regionsTotal[currentRegion.id].total
            : data?.total
        }
        badgePosition={"left"}
      />
      <Grid container sx={{ mt: 3, display: "flex" }}>
        <Grid item xs={12} md={6}>
          <List data={data?.list} />
        </Grid>
        <Grid item md={12} lg={6}>
          <Map type={"site"} deselectOnBlur={true} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdministrationSites;
