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

  const {
    data: totalData,
    isLoading: isLoadingTotal,
  } = useTotalAdministrations()
  const currentRegion = useSelector((state) => state.map.region)

  const { data: ageData, isLoading: isLoadingAge } = useAnagraphicData()
  const {
    data: ageRegionData,
    isLoading: isLoadingAgeRegions,
  } = useAnagraphicRegionsData()

  const computedData = useMemo(() => {
    if (!ageRegionData || !ageData) return
    if (currentRegion && currentRegion?.type === 'age') {
      console.log('COMPUTING REGION...')
      return { ...ageRegionData, data: ageRegionData.data[currentRegion.id] }
    } else return ageData
  }, [ageData, ageRegionData, currentRegion])

  const totalDataRegion = useMemo(() => {
    if (!ageRegionData || !ageData) return
    if (currentRegion && currentRegion?.type === 'age')
      if (ageRangeSelected)
        return ageRegionData.data[currentRegion.id][ageRangeSelected.idx].totale
      else
        return ageRegionData.data[currentRegion.id]
          .reduce((sum, curr) => sum + curr.totale, 0)
          .toLocaleString('en-US')
    else if (ageRangeSelected) return ageData.data[ageRangeSelected.idx].totale
    else return totalData
  }, [ageRegionData, ageData, currentRegion])

  console.log(
    'CURRENT REGION',
    currentRegion,
    'AGE  REGIONS COMPUTED',
    computedData,
  )
  return isLoadingTotal || isLoadingAgeRegions || isLoadingAge ? (
    'Loading...'
  ) : (
    <Box>
      <Header title={'Administrations following age ranges'} />
      <BadgeTextGraph
        title={'Total administrations'}
        data={
          currentRegion && currentRegion.type === 'age'
            ? totalDataRegion
            : totalData
        }
        badgePosition={'left'}
      />
      <Graph
        data={computedData}
        onClick={(el, type, idx) =>
          setAgeRangeSelected({ range: el.fascia_anagrafica, type, idx })
        }
        ageRangeSelected={ageRangeSelected}
      />
      <Map type={'age'} deselectOnBlur={false} />
    </Box>
  )
}

const Graph = ({ data, onClick, ageRangeSelected }) => {
  const { width, ref } = useWidth()
  const barWidth = 25
  const height = 500
  const barMargin = 52
  console.log('AGE RANGE SELECTED', ageRangeSelected)
  const margin = width / 2
  return (
    <Box sx={{ position: 'relative' }}>
      <svg
        width="100%"
        height={height}
        ref={ref}
        id="week-graph"
        data-name="week-graph"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={'0 0  680 350'}
      >
        <g transform={`translate(${margin} 0) rotate(90)`}>
          {data?.data.map((el, i) => (
            <g>
              <text
                className="bar_text"
                transform={`rotate(-90)`}
                x={-(height + 50)}
                y={16 + i * (barWidth + 2)}
              >{`Range ${el.fascia_anagrafica}`}</text>
              {data?.doseTypes.map((type, j) => (
                <HtmlTooltip
                  TransitionComponent={Zoom}
                  followCursor={true}
                  title={
                    <BarTooltip
                      data={{
                        type: type.label,
                        value: el[type.key].toLocaleString('en-US'),
                        ageRange: el.fascia_anagrafica,
                        percentage: ((el[type.key] * 100) / el.totale).toFixed(
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
                    height={formatData(el[type.key])}
                    fill={
                      ageRangeSelected?.range === el.fascia_anagrafica &&
                      ageRangeSelected?.type.key === type.key
                        ? '#F00'
                        : barColors[j]
                    }
                    x={i * (barWidth + 2)}
                    y={height - barMargin - formatData(el[type.key])}
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
          {`Vaccinated ${data.value} on a total of ${data.total} people`}
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

const formatData = (value) => value / 20000
