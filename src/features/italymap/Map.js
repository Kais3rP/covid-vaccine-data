import { styled } from '@mui/system'
import React from 'react'
import { regionAttributes } from './data'
import Region from './Region'

const SvgMap = styled('svg')({
  objectFit: 'cover',
})

const Map = () => {
  return (
    <SvgMap
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/SvgMap"
      viewBox="-200 0 1000 800"
      width="500"
      height="500"
    >
      {regionAttributes.map((x, i) => (
        <Region
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
    </SvgMap>
  )
}

export default Map
