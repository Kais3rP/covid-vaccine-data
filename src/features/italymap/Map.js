import { Typography, Box } from '@mui/material'
import React from 'react'
import { regionAttributes } from './data'
import Region from './Region'

const Map = ({ data, type, deselectOnBlur = true }) => {
  return (
    <Box>
      {' '}
      <svg
        sx={{ objectFit: 'cover' }}
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-200 0 1000 800"
        width="500"
        height="500"
      >
        {regionAttributes.map((x, i) => (
          <Region
            deselectOnBlur={deselectOnBlur}
            type={type}
            key={i}
            lat={x.lat}
            lon={x.lon}
            id={x.id}
            x={x.x}
            y={x.y}
            d={x.d}
            transform={x.transform}
          />
        ))}
        ;
      </svg>
      {!!data && (
        <>
          <Typography align={'center'} color={'text.secondary'} variant={'h3'}>
            {data}
          </Typography>
          <Typography align={'center'} color={'text.secondary'} variant={'h5'}>
            Total administrations
          </Typography>
        </>
      )}
    </Box>
  )
}

export default Map
