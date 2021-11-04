import {
  useGetAdministeredQuery,
  useGetAdministeredSummaryQuery,
  useGetAnagraphicDataQuery,
  useGetAnagraphicPopulationDataQuery,
  useGetSummaryQuery,
} from '../../../services'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useMemo } from 'react'
import {
  sumObjectsByKey,
  sumObjectsByKeyAndType,
  sumObjectsByKeyInclusive,
  sumObjectsByKeySelective,
} from '../../../utils'
import { KeyboardReturnRounded, LegendToggle } from '@mui/icons-material'
import { ageRange, ageRangePeople, brands, regionsData } from '../../../data'

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

const totalPopulation = 59500000
const under12 = 6024595
const over12 = totalPopulation - under12

export const useTotalDelivered = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery()

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  /*   console.log('SUMMARY DATA   ', data)
   */
  const total = useMemo(() => {
    if (!data) return
    else
      return data.data
        .reduce((acc, curr) => acc + curr.dosi_consegnate, 0)
        .toLocaleString('en-US')
  }, [data])

  return { data: total, isLoading }
}

export const useTotalAdministrations = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery()

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  /*   console.log('SUMMARY DATA   ', data)
   */
  const total = useMemo(() => {
    if (!data) return
    else
      return data.data
        .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
        .toLocaleString('en-US')
  }, [data])

  return { data: total, isLoading }
}

export const useAnagraphicData = () => {
  /**
   *
   *  COSTANTS
   *
   */

  const keys = [
    'prima_dose',
    'seconda_dose',
    'dose_booster',
    'dose_aggiuntiva',
    'fascia_anagrafica',
    'people',
    'totale',
  ]

  const regions = [...Object.values(regionsData).map((el) => el.label), 'Total']

  /**
   *
   *  QUERIES
   *
   */

  let {
    data: totalData,
    isLoading: totalIsLoading,
    isSuccess: totalIsSuccess,
  } = useGetAnagraphicDataQuery()
  let {
    data: peopleData,
    isLoading: peopleIsLoading,
    isSuccess: peopleIsSuccess,
  } = useGetAnagraphicPopulationDataQuery()
  let { data, isLoading, isSuccess } = useGetAdministeredQuery()

  /**
   *
   *  MANIPULATED DATA
   *
   */

  totalData = useMemo(() => {
    if (!totalData) return
    else
      return totalData.data
        .map((el, i) =>
          i === 7
            ? sumObjectsByKeyInclusive(
                {
                  ...el,
                  fascia_anagrafica: '80+',
                  people: ageRangePeople['80+'],
                },
                totalData.data[i + 1],
              )
            : {
                ...el,
                people: ageRangePeople[el.fascia_anagrafica],
              },
        )
        .filter((el, i) => i !== 8)
  }, [totalData])

  const agesArr = ageRange.map((el) => ({
    fascia_anagrafica: el,
    prima_dose: 0,
    seconda_dose: 0,
    dose_booster: 0,
    dose_aggiuntiva: 0,
    people: 0,
    totale: 0,
  }))

  let defaultObj = useMemo(
    () =>
      peopleData && totalData
        ? regions.reduce((obj, el) => {
            if (el === 'Total') obj[el] = totalData
            else {
              const _agesArr = agesArr.map((el2) => ({
                ...el2,
                people: peopleData.data.find(
                  (el3) =>
                    el3.nome_area === el &&
                    el3.fascia_anagrafica === el2.fascia_anagrafica,
                )?.totale_popolazione,
              }))
              obj[el] = _agesArr
            }
            return obj
          }, {})
        : null,
    [peopleData, totalData],
  )

  const computedData = useMemo(() => {
    if (!data || !defaultObj) return
    else {
      return data.data.reduce(
        (obj, el, i) => {
          if (obj[el.nome_area]) {
            const idx = obj[el.nome_area].findIndex((el2) => {
              return el.fascia_anagrafica === '80-89' ||
                el.fascia_anagrafica === '90+'
                ? el2.fascia_anagrafica === '80+'
                : el2.fascia_anagrafica === el.fascia_anagrafica
            })

            obj[el.nome_area][idx].totale +=
              el.prima_dose +
              el.seconda_dose +
              el.dose_aggiuntiva +
              el.dose_booster
            obj[el.nome_area][idx] = sumObjectsByKeySelective(
              keys,
              obj[el.nome_area][idx],
              el,
            )
          }
          return obj
        },
        { ...defaultObj },
      )
    }
  }, [data])

  return {
    data: {
      data: computedData,
      doseTypes: [
        { key: 'people', label: 'Total' },
        { key: 'prima_dose', label: 'First dose' },
        { key: 'seconda_dose', label: 'Second/Single shot dose' },
        { key: 'dose_booster', label: 'Booster dose' },
      ],
    },
    isLoading,
    isSuccess,
  }
}

export const useAdministeredSummaryData = () => {
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

export const useAdministeredData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredQuery()

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
  /*   console.log('COMPUTED DATA SUPPLIER / DATE', computedData)
   */ return {
    data: {
      data: computedData,
      brands,
    },
    isLoading,
    isSuccess,
  }
}
/* 
export const useAdministeredAgeRegion = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredQuery()

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
  return {
    data: {
      data: computedData,
      brands,
    },
    isLoading,
    isSuccess,
  }
} */

export const useSummaryData = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery()

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  /*   console.log('SUMMARY DATA   ', data)
   */
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
