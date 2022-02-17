import { Box, Container, Grid, Slider, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import { useAdministeredData } from './hooks'
import Zoom from '@mui/material/Zoom'
import Header from '../../components/reusable/Header'
import people from '../../img/group_person.svg'
import { Badge } from '../../components/reusable/Badge'
import { DateAxis } from '../../components/reusable/Axis'
import { useWidth } from '../../hooks'
import { format } from 'date-fns'
import HtmlTooltip from '../../components/reusable/HtmlTooltip'
import { brands, barColors } from '../../data'
import ReactSlider from 'react-slider'

const legendData = brands.reduce((obj, el, i) => {
  obj[el.label] = barColors[i]
  return obj
}, {})

const WeeklyGraph = () => {
  return (
    <Box>
      <Header title={'Administrations weekly trend'} />

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
            <Legend data={legendData} />
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
            <Typography variant={'h7'} align={'center'}>
              *Pass with mouse on the graph bars to show the weekly data
            </Typography>
            <Box>
              <Graph />
            </Box>
            <Box sx={{ mx: 'auto', mt: 2 }}>
              <Typography variant={'h7'} align={'center'}>
                *Move selectors to zoom left and right
              </Typography>
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
  const barWidthBase = 8
  const [barWidth, setBarWidth] = useState(barWidthBase)
  const height = 500
  const barMargin = 52
  const { data, isLoading } = useAdministeredData()
  const [graphData, setGraphData] = useState(data?.data)
  const margin = 100

  const onRangeChange = debounce((val, selector) => {
    setGraphData((arr) => data.data.slice(val[0], val[1]))
    setBarWidth(width / data.data.slice(val[0], val[1]).length)
  }, 5)

  useEffect(() => {
    if (data?.data) {
      setGraphData(data.data)
    }
  }, [data?.data])

  return isLoading ? (
    'Loading...'
  ) : (
    <Box sx={{ position: 'relative' }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="week-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={'50 20 1000 350'}
      >
        <g transform={`translate(${margin} 0)`}>
          {graphData &&
            graphData.map((el, i) =>
              data.brands.map((brand, j) => (
                <HtmlTooltip
                  key={brand.key}
                  TransitionComponent={Zoom}
                  followCursor={true}
                  title={
                    <BarTooltip
                      data={{
                        dateRange: formatRange(el[0]),
                        data: {
                          brand: brand.label,
                          value: el[1][brand.key],
                        },
                      }}
                    />
                  }
                >
                  <rect
                    className="bar"
                    width={barWidth}
                    height={formatData(el[1][data.brands[j].key])}
                    fill={barColors[j]}
                    x={i * (barWidth + 2)}
                    y={
                      height -
                      barMargin -
                      formatData(el[1][data.brands[j]?.key]) -
                      formatData(el[1][data.brands[j + 1]?.key] || 0)
                    }
                  />
                </HtmlTooltip>
              )),
            )}
        </g>

        <DateAxis
          data={graphData}
          containerWidth={width}
          containerHeight={height}
          width={barWidth}
          margin={margin}
        />
      </svg>
      <Container>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="thumb"
          trackClassName="track"
          defaultValue={[0, data?.data?.length]}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          pearling
          minDistance={5}
          onChange={onRangeChange}
          max={data?.data?.length}
        />
      </Container>
    </Box>
  )
}

const BarTooltip = ({ data }) => {
  return (
    <>
      {' '}
      <Typography color="inherit">
        {data.data.brand === 'Pfizer Pediatrico'
          ? 'Pediatric Pfizer'
          : data.data.brand}
      </Typography>
      <Typography color="inherit">
        {data.data.value.toLocaleString('it')}
      </Typography>
      <Typography color="inherit">{`from ${format(
        new Date(data?.dateRange[0]),
        'dd/MM',
      )} to ${format(new Date(data?.dateRange[1]), 'dd/MM')}`}</Typography>
    </>
  )
}

const Legend = ({ data }) => {
  return (
    <Box sx={{ mt: 3 }}>
      {Object.entries(data).map((el) => (
        <Box key={el[0]} sx={{ display: 'flex', mb: 1 }}>
          <Box
            sx={{
              mr: 2,
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: el[1],
            }}
          />

          <Typography variant="h7">{el[0]}</Typography>
        </Box>
      ))}
    </Box>
  )
}

const formatData = (value) => value / 10000
const formatRange = (date) => [
  date,
  new Date(new Date(date).setDate(new Date(date).getDate() + 7)).toISOString(),
]
