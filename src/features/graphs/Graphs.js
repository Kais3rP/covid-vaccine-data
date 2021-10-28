import { Box, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Map from '../italymap/Map'
import { useAdministeredSummaryData } from './hooks'

import RegionsData from './RegionsData'
import TextGraph from './TextGraph'
import WeeklyGraph from './WeeklyGraph'

const Graphs = () => {
  /*   const {
    data: anagraphicData,
    isLoading: anagraphicIsLoading,
  } = useAnagraphicData() */

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
      <RegionsData />
      <WeeklyGraph />
      {/* {anagraphicIsLoading
        ? 'Loading...'
        : Object.entries(anagraphicData).map((data) => (
            <Graph key={data[0]} data={data[1]} />
          ))} */}
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
