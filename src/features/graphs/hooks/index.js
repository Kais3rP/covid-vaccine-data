import {
  useGetAdministeredSummaryQuery,
  useGetAnagraphicDataQuery,
  useGetSummaryQuery,
} from '../../../services'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useMemo } from 'react'

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

export const useAdministeredData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredSummaryQuery()
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

export const useSummaryData = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery()

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  console.log(' REGIONS ', data)

  data = useMemo(() => {
    if (!data) return
    else
      return {
        rows: data.data.map((el) => ({
          id: el.index,
          region: el.nome_area,
          administered: el.dosi_consegnate,
          delivered: el.dosi_somministrate,
          percentage: el.percentuale_somministrazione,
        })),
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
