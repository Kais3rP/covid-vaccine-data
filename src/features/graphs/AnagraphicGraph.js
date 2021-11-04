import { Box, Container, Grid, Slider, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Header from '../../components/reusable/Header'
import HtmlTooltip from '../../components/reusable/HtmlTooltip'
import BadgeTextGraph from './BadgeTextGraph'
import {
  useAnagraphicData,
  useAnagraphicRegionsData,
  useTotalAdministrations,
} from './hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import { useAdministeredData } from './hooks'
import Zoom from '@mui/material/Zoom'
import people from '../../img/group_person.svg'
import { useWidth } from '../../hooks'
import { format } from 'date-fns'
import { barColors } from '../../data'
import Map from '../italymap/Map'

import { useGetAdministeredQuery } from '../../services'

const AnagraphicGraph = () => {
  const [ageRangeSelected, setAgeRangeSelected] = useState(null)
  const currentRegion = useSelector((state) => state.map.region)
  const { data, isLoading } = useAnagraphicData()
  console.log('CURRENT AGE SELECTED', ageRangeSelected)

  const computedData = useMemo(() => {
    if (!data.data) return
    if (currentRegion && currentRegion?.type === 'age') {
      return { ...data, data: data.data[currentRegion.id] }
    } else return { ...data, data: data.data.Total }
  }, [data, currentRegion])
  console.log('ANAGRAPHIC COMPUTED', computedData)

  const totalNumber = useMemo(() => {
    if (!computedData) return
    if (ageRangeSelected)
      return computedData.data
        .find((el) => el.fascia_anagrafica === ageRangeSelected.range)
        [ageRangeSelected.type.key].toLocaleString('en-US')
    else
      return computedData.data
        .reduce((sum, curr) => sum + curr.totale, 0)
        .toLocaleString('en-US')
  }, [computedData])

  return isLoading ? (
    'Loading...'
  ) : (
    <Box>
      <Header title={'Administrations following age ranges'} />
      <BadgeTextGraph
        title={'Total administrations'}
        data={totalNumber}
        badgePosition={'left'}
      />
      <Grid container sx={{ mt: 3, display: 'flex' }}>
        <Grid item xs={12} md={6}>
          <Graph
            data={computedData}
            onClick={(el, type, idx) => {
              if (
                ageRangeSelected &&
                ageRangeSelected.type.key === type.key &&
                ageRangeSelected.range === el.fascia_anagrafica
              )
                setAgeRangeSelected(null)
              else
                setAgeRangeSelected({ range: el.fascia_anagrafica, type, idx })
            }}
            ageRangeSelected={ageRangeSelected}
            isRegionSelected={currentRegion && currentRegion.type === 'age'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Map type={'age'} deselectOnBlur={false} showData={false} />
        </Grid>
      </Grid>
    </Box>
  )
}

const Graph = ({ data, onClick, ageRangeSelected, isRegionSelected }) => {
  const { width, ref } = useWidth()
  const barWidth = 45
  const height = 600
  const barMargin = 56
  const margin = width / 2
  const barMarginX = 10
  return (
    <Box sx={{ position: 'relative' }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="week-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={'-500 100  680 350'}
      >
        <g transform={`translate(${margin} 0) rotate(90)`}>
          {data?.data.map((el, i) => (
            <g>
              <text
                className="bar_text"
                transform={`rotate(-90)`}
                x={-(height + 40)}
                y={barWidth / 2 + i * (barWidth + barMarginX)}
              >{`Range ${el.fascia_anagrafica}`}</text>
              {data?.doseTypes.map((type, j) => (
                <HtmlTooltip
                  TransitionComponent={Zoom}
                  followCursor={true}
                  title={
                    <BarTooltip
                      data={{
                        type: type.label,
                        value: el[type.key]?.toLocaleString('en-US'),
                        ageRange: el.fascia_anagrafica,
                        percentage: ((el[type.key] * 100) / el.people).toFixed(
                          1,
                        ),
                        total: el.people.toLocaleString('en-US'),
                        isTotal: type.key === 'people',
                      }}
                    />
                  }
                >
                  <rect
                    onClick={() => onClick(el, type, i)}
                    className="bar"
                    width={barWidth}
                    height={formatData(el[type.key], isRegionSelected && 'big')}
                    fill={
                      ageRangeSelected?.range === el.fascia_anagrafica &&
                      ageRangeSelected?.type.key === type.key
                        ? '#F00'
                        : barColors[j]
                    }
                    x={i * (barWidth + barMarginX)}
                    y={
                      height -
                      barMargin -
                      formatData(el[type.key], isRegionSelected && 'big')
                    }
                  />
                </HtmlTooltip>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </Box>
  )
}

export default AnagraphicGraph

const BarTooltip = ({ data }) => {
  console.log('TOOLTIP DATA', data, data.isTotal)
  return (
    <>
      {' '}
      <Typography color="inherit">{`Age range: ${data.ageRange}`}</Typography>
      <Typography color="inherit">{data.type}</Typography>
      <Typography color="inherit">{data.value}</Typography>
      {!data.isTotal && (
        <Typography color="inherit">{`(${data.percentage})%`}</Typography>
      )}
      {!data.isTotal && (
        <Typography color="inherit">
          {`Vaccinated ${data.value} on a total of ${data.people} people`}
        </Typography>
      )}
    </>
  )
}

const Legend = ({ data }) => {
  console.log('LEGEND', Object.entries(data))
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

const formatData = (value, type) => value / (type === 'big' ? 2000 : 30000)
