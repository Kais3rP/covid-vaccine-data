import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'

export const ScaleAxis = ({ data }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(data.domain).range(data.range)
    console.log('SCALE', data)
    return xScale.ticks().map((value) => ({
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

export const DateAxis = ({
  data,
  containerHeight,
  length,
  margin,
}) => {
  const tickWidth = 10
  const ticksNumber = data.length
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: format(new Date(el[0]), 'dd/MM'),
      xOffset: (i * (10 - length)) / 2,
    }))
  }, [data, length])
console.log(data, ticks )
  return (
    <>
      {ticks?.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${margin + 4 + xOffset}, ${
            containerHeight - 50
          })`}
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

export const RandomAxis = ({
  data,
  containerWidth,
  containerHeight,
  leftCounterMargin = 0,
  margin,
}) => {
  const tickWidth = 10
  const ticksNumber = data.length
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: el,
      xOffset: leftCounterMargin + i * tickWidth,
    }))
  }, [data])

  /*   console.log('TICKS', ticks, 'WIDTH', containerWidth, 'MARGIN', margin)
   */ return (
    <>
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

export const RandomAxisHorizontal = ({
  data,
  containerHeight,
  xGap = 2,
  margin,
}) => {
  console.log('AXIS DATA', data)
  const tickWidth = xGap
  const ticksNumber = data.length
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: el,
      xOffset: i * tickWidth + 75,
    }))
  }, [data])
  margin = margin - xGap / 4 - 5
  return (
    <>
      <line
        x2={xGap * ticksNumber}
        y2="0"
        transform={`translate(${margin}, ${containerHeight - 90})`}
        stroke="currentColor"
      />
      <line
        y2="6"
        transform={`translate(${margin}, ${containerHeight - 90})`}
        stroke="currentColor"
      />
      <line
        y2="6"
        transform={`translate(${margin + xGap * ticksNumber}, ${
          containerHeight - 90
        })`}
        stroke="currentColor"
      />
      {ticks?.map(({ value, xOffset }, i) => (
        <g
          key={value}
          transform={`translate(${margin + xOffset}, ${containerHeight - 90})`}
        >
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '8px',
              textAnchor: 'middle',
              transform: `translateY(20px) translateX(0px)`,
              fill: 'currentColor',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  )
}
