import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";

export const ScaleAxis = ({ data }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(data.domain).range(data.range);
    console.log("SCALE", data);
    return xScale.ticks().map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, []);
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
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const DateAxis = ({ data, containerHeight, margin, width }) => {
  const ticksNumber = data?.length;
  const ticks = useMemo(() => {
    return data?.map((el, i) => ({
      value: format(new Date(el[0]), "dd/MM"),
      xOffset: i * (width + 2),
    }));
  }, [data]);

  return (
    <>
      {ticks?.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${margin + xOffset + 5}, ${
            containerHeight - 50
          })`}
        >
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "8px",
              textAnchor: "middle",
              transform: "translateY(20px) translateX(-2px) rotate(90deg)",
              fill: "#DDD",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

export const RandomAxis = ({
  data,
  containerWidth,
  containerHeight,
  leftCounterMargin = 0,
  margin,
}) => {
  const tickWidth = 10;
  const ticksNumber = data.length;
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: el,
      xOffset: leftCounterMargin + i * tickWidth,
    }));
  }, [data]);

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
              fontSize: "8px",
              textAnchor: "middle",
              transform: "translateY(20px) translateX(-2px) rotate(90deg)",
              fill: "#DDD",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

export const RandomAxisHorizontal = ({
  data,
  containerHeight,
  containerWidth,
  tickWidth,
  margin,
}) => {
  const ticks = useMemo(() => {
    return data.map((el, i) => ({
      value: el,
      xOffset: tickWidth / 2 + i * (tickWidth + margin),
    }));
  }, [data, margin, tickWidth]);

  return (
    <>
      <line
        y1={containerHeight - 15}
        x2={containerWidth}
        y2={containerHeight - 15}
        stroke="currentColor"
      />
      <line
        x1={0}
        y1={containerHeight - 15}
        x2={0}
        y2={containerHeight - 10}
        stroke="currentColor"
      />
      <line
        x1={containerWidth}
        y1={containerHeight - 15}
        x2={containerWidth}
        y2={containerHeight - 10}
        stroke="currentColor"
      />
      {ticks?.map(({ value, xOffset }, i) => (
        <g key={value}>
          <line
            x1={xOffset}
            y1={containerHeight - 15}
            x2={xOffset}
            y2={containerHeight - 10}
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "0.7rem",
              textAnchor: "middle",
              fill: "currentColor",
            }}
            x={xOffset}
            y={containerHeight}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
