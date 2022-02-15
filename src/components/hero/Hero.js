import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Badge } from '../reusable/Badge'
import meds from '../../img/meds.png'
import { format } from 'date-fns'
import { useGetSummaryQuery } from '../../services'

const Hero = () => {
  const { data, isLoading } = useGetSummaryQuery()

  return (
    <>
      <Container>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Report aggiornato al: {format(new Date(), 'MM/dd/yyyy')}
        </Typography>
      </Container>
      <Container
        sx={{
          pb: 2,
          pt: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            pb: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            borderBottom: '1px solid #000',
          }}
        >
          {' '}
          <Badge src={meds} alt="meds" width={6} />
          <Typography
            sx={{ lineHeight: 0.8, ml: 5 }}
            component="h1"
            variant="h3"
            align="center"
            color="text.secondary"
          >
            {isLoading
              ? 'Loading...'
              : data?.data
                  .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
                  .toLocaleString('it')}
          </Typography>
        </Box>{' '}
      </Container>
    </>
  )
}

export default Hero
