import {
  useGetAdministeredQuery,
  useGetAdministeredSummaryQuery,
  useGetAnagraphicDataQuery,
  useGetSummaryQuery,
} from '../../../services'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useMemo } from 'react'
import { sumObjectsByKey } from '../../../utils'

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

const totalPopulation = 59500000
const under12 = 6024595
const over12 = totalPopulation - under12

export const useAnagraphicData = () => {
  let { data, isLoading, isSuccess } = useGetAnagraphicDataQuery()

  return {
    isLoading,
    isSuccess,
    data,
  }
}

export const useAdministeredSummaryData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredSummaryQuery()
  console.log(' ADMINISTRATIONS SUMMARY ', data)
  const firstDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.prima_dose, 0)
  }, [data])
  const firstDosePlusNaturalImmunity = useMemo(() => {
    return data?.data.reduce(
      (acc, curr) => acc + curr.prima_dose + curr.pregressa_infezione,
      0,
    )
  }, [data])
  const secondDosePlusNaturalImmunity = useMemo(() => {
    return data?.data.reduce(
      (acc, curr) => acc + curr.prima_dose + curr.pregressa_infezione,
      0,
    )
  }, [data])
  const secondDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.seconda_dose, 0)
  }, [data])
  const additionalDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.dose_aggiuntiva, 0)
  }, [data])
  const boosterDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.dose_booster, 0)
  }, [data])

  return {
    data: data && {
      firstDose: {
        total: firstDoseTotal.toLocaleString('en-US'),
        totalPlusNatural: firstDosePlusNaturalImmunity.toLocaleString('en-US'),
        percentageOnTotal: ((firstDoseTotal * 100) / totalPopulation).toFixed(
          0,
        ),
        percentageOnOver12: ((firstDoseTotal * 100) / over12).toFixed(0),
      },
      secondDose: {
        total: secondDoseTotal.toLocaleString('en-US'),
        totalPlusNatural: secondDosePlusNaturalImmunity.toLocaleString('en-US'),
        percentageOnTotal: ((secondDoseTotal * 100) / totalPopulation).toFixed(
          0,
        ),
        percentageOnOver12: ((secondDoseTotal * 100) / over12).toFixed(0),
      },
      additionalDose: {
        total: additionalDoseTotal.toLocaleString('en-US'),
      },
      boosterDose: {
        total: boosterDoseTotal.toLocaleString('en-US'),
      },
    },
    isLoading,
    isSuccess,
  }
}

export const useAdministeredData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredQuery()
  console.log('ADMINISTRATIONS', data)
  const brands = [
    'Pfizer/BioNTech',
    'Moderna',
    'Vaxzevria (AstraZeneca)',
    'Janssen',
  ]
  const computedData = useMemo(() => {
    const defaultObj = {
      'Pfizer/BioNTech': 0,
      Moderna: 0,
      'Vaxzevria (AstraZeneca)': 0,
      Janssen: 0,
    }
    let prevDate
    return (
      data &&
      Object.entries(
        Object.entries(
          data.data.reduce((obj, el) => {
            if (obj[el.data_somministrazione])
              obj[el.data_somministrazione][el.fornitore] +=
                el.prima_dose + el.seconda_dose
            else {
              const newObj = { ...defaultObj }
              newObj[el.fornitore] = el.prima_dose + el.seconda_dose
              obj[el.data_somministrazione] = newObj
            }
            return obj
          }, {}),
        ).reduce((obj, el, i) => {
          if (i === 0 || i % 7 === 0) {
            obj[el[0]] = el[1]
            prevDate = el[0]
          } else obj[prevDate] = sumObjectsByKey(obj[prevDate], el[1])
          return obj
        }, {}),
      )
    )
  }, [data])
  console.log('COMPUTED DATA', computedData)
  return {
    data: {
      data: computedData,
      brands,
    },
    isLoading,
    isSuccess,
  }
}

export const useSummaryData = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery()

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  console.log('SUMMARY DATA   ', data)

  data = useMemo(() => {
    if (!data) return
    else
      return {
        rows: [
          ...data.data.map((el) => ({
            id: el.index,
            region: el.nome_area,
            administered: el.dosi_consegnate.toLocaleString('en-US'),
            delivered: el.dosi_somministrate.toLocaleString('en-US'),
            percentage: el.percentuale_somministrazione + '%',
          })),
          {
            id: 'total',
            region: 'Total',
            administered: data.data
              .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
              .toLocaleString('en-US'),
            delivered: data.data
              .reduce((acc, curr) => acc + curr.dosi_consegnate, 0)
              .toLocaleString('en-US'),
            percentage:
              (
                data.data.reduce(
                  (acc, curr) => acc + curr.percentuale_somministrazione,
                  0,
                ) / 21
              ).toFixed(1) + '%',
          },
        ],
        columns: [
          {
            field: 'region',
            headerName: 'Regions',
            headerClassName: 'grid-header',
          },
          {
            field: 'administered',
            headerName: 'Administered Doses',
            headerClassName: 'grid-header',
          },
          {
            field: 'delivered',
            headerName: 'Delivered Doses',
            headerClassName: 'grid-header',
          },
          {
            field: 'percentage',
            headerName: '%',
            headerClassName: 'grid-header',
          },
        ],
      }
  }, [data])
  return {
    data,
    isLoading,
    isSuccess,
  }
}
