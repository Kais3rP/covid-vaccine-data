import { Box, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../components/reusable/Header'
import BadgeTextGraph from './BadgeTextGraph'
import {
  useAnagraphicData,
  useTotalAdministrations,
  useTotalDelivered,
} from './hooks'

const DeliveredGraph = () => {
  const { data: total, isLoading } = useTotalDelivered()

  return isLoading ? (
    'Loading...'
  ) : (
    <Box>
      <Header title={'Vaccine delivery / suppliers'} />
      <BadgeTextGraph
        title={'Total delivered doses'}
        data={total}
        badgePosition={'left'}
      />
    </Box>
  )
}

export default DeliveredGraph
