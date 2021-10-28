import { Box, Container, Grid, Slider, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import { useAdministeredData } from './hooks'
import Zoom from '@mui/material/Zoom'

import people from '../../img/group_person.svg'
import { Badge } from '../../components/reusable/Badge'
import { Axis } from '../../components/reusable/Axis'
import { useWidth } from '../../hooks'
import { format } from 'date-fns'
import HtmlTooltip from '../../components/reusable/HtmlTooltip'

const WeeklyGraph = () => {
  return (
    <Box>
      <Container
        sx={{ backgroundColor: 'secondary.main', p: 10 }}
        maxWidth="false"
      >
        {' '}
        <Typography color={'text.secondary'} variant={'h4'} align={'center'}>
          Administrations weekly trend
        </Typography>
      </Container>
      <Grid
        container
        sx={{
          backgroundColor: 'primary.main',
          pt: 2,
          pb: 2,
          mt: 2,
          display: 'flex',
        }}
      >
        <Grid item xs={12} md={3}>
          <Box sx={{ m: 2 }}>
            <Badge src={people} alt="people" width={10} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: 'flex',
          }}
        >
          <Container
            sx={{
              m: 2,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {' '}
            <Typography variant={'h6'} align={'center'}>
              *Pass with mouse on the graph bars to show the weekly data
            </Typography>
            <Box>
              <Graph />
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}

export default WeeklyGraph

const Graph = () => {
  const { width, ref } = useWidth()
  const [zoom, setZoom] = useState(8)
  const barWidth = 8
  const height = 500
  const barMargin = 52
  const barColors = ['#263238', '#546e7a', '#90a4ae', '#eceff1', '#78909c']
  const {
    data,
    isLoading,
  } = useAdministeredData() /* console.log('SCALE', xScale) */

  /*   const yScale = d3.scaleLinear().domain(data.map(el => el.)).range([0-500])
   */

  /*   console.log('WEEKLY GRAPH', data)
   */ const margin = (width - data?.data?.length * (barWidth + 2)) / 2 - 4
  return isLoading ? (
    'Loading...'
  ) : (
    <Box sx={{ position: 'relative' }}>
      <svg width="100%" height={height} ref={ref}>
        <g transform={`translate(${margin} 0)`}>
          {data?.data.map((el, i) => (
            <>
              <HtmlTooltip
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: data.brands[0],
                        value: el[1][data.brands[0]],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth + zoom}
                  height={formatData(el[1][data.brands[0]])}
                  fill={barColors[0]}
                  x={i * (barWidth + 2 + zoom)}
                  y={height - barMargin - formatData(el[1][data.brands[0]])}
                />
              </HtmlTooltip>
              <HtmlTooltip
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: data.brands[1],
                        value: el[1][data.brands[1]],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth + zoom}
                  height={formatData(el[1][data.brands[1]])}
                  fill={barColors[1]}
                  x={i * (barWidth + 2 + zoom)}
                  y={
                    height -
                    barMargin -
                    (formatData(el[1][data.brands[0]]) +
                      formatData(el[1][data.brands[1]]))
                  }
                />
              </HtmlTooltip>
              <HtmlTooltip
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: data.brands[2],
                        value: el[1][data.brands[2]],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth + zoom}
                  height={formatData(el[1][data.brands[2]])}
                  fill={barColors[2]}
                  x={i * (barWidth + 2 + zoom)}
                  y={
                    height -
                    barMargin -
                    (formatData(el[1][data.brands[0]]) +
                      formatData(el[1][data.brands[1]]) +
                      formatData(el[1][data.brands[2]]))
                  }
                />
              </HtmlTooltip>
              <HtmlTooltip
                TransitionComponent={Zoom}
                followCursor={true}
                title={
                  <BarTooltip
                    data={{
                      dateRange: formatRange(el[0]),
                      data: {
                        brand: data.brands[3],
                        value: el[1][data.brands[3]],
                      },
                    }}
                  />
                }
              >
                <rect
                  className="bar"
                  width={barWidth + zoom}
                  height={formatData(el[1][data.brands[3]])}
                  fill={barColors[3]}
                  x={i * (barWidth + 2 + zoom)}
                  y={
                    height -
                    barMargin -
                    (formatData(el[1][data.brands[0]]) +
                      formatData(el[1][data.brands[1]]) +
                      formatData(el[1][data.brands[2]]) +
                      formatData(el[1][data.brands[3]]))
                  }
                />
              </HtmlTooltip>
            </>
          ))}
        </g>

        <Axis
          data={data?.data}
          containerWidth={width}
          containerHeight={height}
          zoom={zoom}
        />
      </svg>
      <Container>
        <Slider
          getAriaLabel={() => 'Zoom range'}
          value={barWidth}
          onChange={debounce((e, val) => setZoom(val), 2)}
          valueLabelDisplay="auto"
          getAriaValueText={(val) => val}
        />
      </Container>
    </Box>
  )
}

const BarTooltip = ({ data }) => {
  /*   console.log('TOOLTIP DATA', data)
   */ return (
    <>
      {' '}
      <Typography color="inherit">{data.data.brand}</Typography>
      <Typography color="inherit">
        {data.data.value.toLocaleString('en-US')}
      </Typography>
      <Typography color="inherit">{`from ${format(
        new Date(data?.dateRange[0]),
        'dd/MM',
      )} to ${format(new Date(data?.dateRange[1]), 'dd/MM')}`}</Typography>
    </>
  )
}

const formatData = (value) => value / 10000
const formatRange = (date) => [
  date,
  new Date(new Date(date).setDate(new Date(date).getDate() + 7)).toISOString(),
]
