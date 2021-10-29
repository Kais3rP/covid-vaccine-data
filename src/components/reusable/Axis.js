import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'

export const ScaleAxis = ({ data }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(data.domain).range(data.range)
    /*     console.log('SCALE', xScale)
     */ return xScale.ticks().map((value) => ({
      value,
      xOffset: xScale(value),
    }))
  }, [])
  /*   console.log('TICKS', ticks)
   */ return (
    <svg>
      <path d="M 9.5 0.5 H 290.5" stroke="currentColor" />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  )
}

export const Axis = ({
  data,
  containerWidth,
  containerHeight,
  zoom,
  isZoomingLeft,
  leftCounterMargin,
}) => {
  /*   console.log('AXIS DATA', data)
   */ const tickWidth = 10
  const ticksNumber = data.length
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: format(new Date(el[0]), 'dd/MM'),
      xOffset: isZoomingLeft
        ? leftCounterMargin + i * (10 + zoom) + zoom / 2
        : i * (10 + zoom) + zoom / 2,
    }))
  }, [data, zoom, isZoomingLeft])

  const margin = (containerWidth - tickWidth * ticksNumber) / 2

  /*   console.log('TICKS', ticks, 'WIDTH', containerWidth, 'MARGIN', margin)
   */ return (
    <>
      {/*       <path d="M 9.5 0.5 H 290.5" stroke="currentColor" />
       */}{' '}
      {ticks?.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${margin + xOffset}, ${containerHeight - 50})`}
        >
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '8px',
              textAnchor: 'middle',
              transform: 'translateY(20px) translateX(-2px) rotate(90deg)',
              fill: '#DDD',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  )
}
