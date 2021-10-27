import { Box, Container, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Map from '../italymap/Map'
import Graph from './Graph'
import { useAdministeredData, useAnagraphicData, useSummaryData } from './hooks'
import List from './List'
import TextGraph from './TextGraph'

const RegionsData = () => {
  let { data: summaryData, isLoading: summaryIsLoading } = useSummaryData()
  const currentRegion = useSelector((state) => state.map.region)
  console.log('REGION', currentRegion, 'SUMMARY', summaryData)
  summaryData = currentRegion
    ? {
        columns: summaryData.columns,
        rows: summaryData.rows.filter((el) => el.region === currentRegion),
      }
    : summaryData
  return summaryIsLoading ? (
    'Loading...'
  ) : (
    <Grid container sx={{ mt: 3, display: 'flex' }}>
      {' '}
      <Grid item xs={12} md={6}>
        {' '}
        <List data={summaryData} />
      </Grid>
      <Grid item xs={12} md={6}>
        {' '}
        <Map />
      </Grid>
      {/* {currentRegion && (
        <Grid
          sx={{
            position: 'fixed',
            top: '5vh',
            left: '5vw',
            width: '90vw',
            height: '90vh',
            backgroundColor: 'primary.main',
            color: 'secondary.main',
            borderRadius: '7px',
            boxShadow: 'main',
          }}
          item
        >
          {<List data={{ ...summaryData }} />}
        </Grid> */}
      )}
    </Grid>
  )
}

const Graphs = () => {
  const {
    data: anagraphicData,
    isLoading: anagraphicIsLoading,
  } = useAnagraphicData()

  return (
    <Box>
      <TextGraph
        title="Totale somministrazioni"
        Comp1={TotalOneDose}
        Comp2={TotalTwoDoses}
      />
      <TextGraph
        title="Totale somministrazioni"
        Comp1={TotalAdditional}
        Comp2={TotalBooster}
      />
      <RegionsData />

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
  const { data, isLoading } = useAdministeredData()
  return isLoading ? (
    'Loading...'
  ) : (
    <>
      {' '}
      <Typography variant="h5" sx={{ mt: '3rem' }}>
        {' '}
        1 dose
      </Typography>
      <Typography variant="h4"> {data.additionalDose.total}</Typography>
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
  const { data, isLoading } = useAdministeredData()
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
  const { data, isLoading } = useAdministeredData()
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
  const { data, isLoading } = useAdministeredData()
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
