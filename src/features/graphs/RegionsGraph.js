import { Box, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Map from '../italymap/Map'
import { useSummaryData } from './hooks'
import List from './List'

const RegionsData = () => {
  let {
    data: summaryData,
    isLoading: summaryIsLoading,
    isSuccess: summaryIsSuccess,
  } = useSummaryData()
  const currentRegion = useSelector((state) => state.map.region)
  summaryData = useMemo(() => {
    return currentRegion
      ? {
          columns: summaryData.columns,
          rows: summaryData.rows.filter((el) => el.region === currentRegion.id),
        }
      : summaryData
  }, [currentRegion, summaryData])
  console.log('REGION', currentRegion, 'SUMMARY', summaryData)

  return summaryIsLoading || !summaryIsSuccess ? (
    'Loading...'
  ) : (
    <Box sx={{ mt: 3 }}>
      {' '}
      <Typography color={'text.secondary'} variant={'h5'} align={'center'}>
        Total administrated compared to delivered doses{' '}
      </Typography>{' '}
      <Grid container sx={{ mt: 3, display: 'flex' }}>
        <Grid item xs={12} md={6}>
          {' '}
          <List data={summaryData} />
        </Grid>
        <Grid item xs={12} md={6}>
          {' '}
          <Map
            type={'summary'}
            data={
              currentRegion
                ? summaryData?.rows[0]?.administered
                : summaryData?.rows[summaryData.rows.length - 1]?.administered
            }
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegionsData
