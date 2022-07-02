import { Box, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../components/reusable/Header'
import Map from '../italymap/Map'
import AdministrationSites from './AdministrationSites'
import AnagraphicGraph from './AnagraphicGraph'
import BadgeTextGraph from './BadgeTextGraph'
import DeliveredGraph from './DeliveredGraph'
import { useAdministeredSummaryData } from './hooks'
import SummaryGraph from './SummaryGraph'
import TextGraph from './TextGraph'
import WeeklyGraph from './WeeklyGraph'

const Graphs = () => {
  return (
    <Box>
      <TextGraph
        title="First and second doses"
        Comp1={() => <TotalDosesAdministered type="firstDose" />}
        Comp2={() => <TotalDosesAdministered type="secondDose" />}
      />
      <TextGraph
        title="Third and fourth doses"
        Comp1={() => <TotalDosesAdministered type="thirdDose" />}
        Comp2={() => <TotalDosesAdministered type="fourthDose" />}
      />
      <SummaryGraph />
      <WeeklyGraph />
      <AnagraphicGraph />
      {/*  <DeliveredGraph />
      <AdministrationSites /> */}
    </Box>
  )
}

export default Graphs

const TotalDosesAdministered = ({ type }) => {
  const { data, isLoading } = useAdministeredSummaryData();

  const title = useMemo(() => {
    switch (type) {
      case "firstDose":
        return "1 dose";
      case "secondDose":
        return "2 doses";
      case "thirdDose":
        return "3 doses";
      case "fourthDose":
        return "4 doses";
      default:
        return "1 dose";
    }
  }, [type]);

  return isLoading ? (
    'Loading...'
  ) : (
    <>
      {" "}
      <Typography variant="h5" sx={{ mt: "3rem" }}>
        {title}
      </Typography>
      <Typography variant="h4"> {data[type].total}</Typography>
      {/* <Typography>
        Total plus natural immunity: {data[type].totalPlusNatural}
      </Typography> */}
      <Typography>{data[type].percentageOnTotal}% of people</Typography>
      <Typography>
        {data[type].percentageOnOver12}% of people over 12
      </Typography>
    </>
  )
}
