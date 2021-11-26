import { Box, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../components/reusable/Header'
import Map from '../italymap/Map'
import AdministrationSites from './AdministrationSites'
import AnagraphicGraph from './AnagraphicGraph'
import BadgeTextGraph from './BadgeTextGraph'
import DeliveredGraph from './DeliveredGraph'
import {
  useAdministeredSummaryData,
  useAnagraphicData,
  useTotalAdministrations,
} from './hooks'

import SummaryGraph from './SummaryGraph'
import TextGraph from './TextGraph'
import WeeklyGraph from './WeeklyGraph'

const Graphs = () => {
  return (
    <Box>
      <TextGraph
        title="Totale somministrazioni"
        Comp1={TotalOneDose}
        Comp2={TotalTwoDoses}
      />
      <TextGraph
        title="Dosi addizionali"
        Comp1={TotalAdditional}
        Comp2={TotalBooster}
      />
      <SummaryGraph />
      <WeeklyGraph /> <AnagraphicGraph />
      <DeliveredGraph />
      <AdministrationSites />
    </Box>
  )
}

export default Graphs

const TotalOneDose = () => {
  const { data, isLoading } = useAdministeredSummaryData()
  return isLoading ? (
    'Loading...'
  ) : (
    <>
      {' '}
      <Typography variant="h5" sx={{ mt: '3rem' }}>
        {' '}
        1 dose
      </Typography>
      <Typography variant="h4"> {data.firstDose.total}</Typography>
      <Typography>
        Total plus natural immunity: {data.firstDose.totalPlusNatural}
      </Typography>
      <Typography>{data.firstDose.percentageOnTotal}% of people</Typography>
      <Typography>
        {data.firstDose.percentageOnOver12}% of people over 12
      </Typography>
    </>
  )
}

const TotalTwoDoses = () => {
  const { data, isLoading } = useAdministeredSummaryData()
  return isLoading ? (
    'Loading...'
  ) : (
    <>
      <Typography variant="h5" sx={{ mt: '3rem' }}>
        {' '}
        2 doses
      </Typography>
      <Typography variant="h4"> {data.secondDose.total}</Typography>
      <Typography>
        Total plus natural immunity: {data.secondDose.totalPlusNatural}
      </Typography>

      <Typography>{data.secondDose.percentageOnTotal}% of people</Typography>
      <Typography>
        {data.secondDose.percentageOnOver12}% of people over 12
      </Typography>
    </>
  )
}

const TotalAdditional = () => {
  const { data, isLoading } = useAdministeredSummaryData()
  return isLoading ? (
    'Loading...'
  ) : (
    <>
      <Typography variant="h5" sx={{ mt: '3rem' }}>
        {' '}
        Additional dose
      </Typography>
      <Typography variant="h4"> {data.additionalDose.total}</Typography>
    </>
  )
}

const TotalBooster = () => {
  const { data, isLoading } = useAdministeredSummaryData()
  return isLoading ? (
    'Loading...'
  ) : (
    <>
      <Typography variant="h5" sx={{ mt: '3rem' }}>
        {' '}
        Booster dose
      </Typography>
      <Typography variant="h4"> {data.boosterDose.total}</Typography>
    </>
  )
}
