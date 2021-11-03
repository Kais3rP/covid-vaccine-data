import {
  useGetAdministeredQuery,
  useGetAdministeredSummaryQuery,
  useGetAnagraphicDataQuery,
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
  let {
    data: totalData,
    isLoading: totalIsLoading,
    isSuccess: totalIsSuccess,
  } = useGetAnagraphicDataQuery()
  let {
    data: peopleData,
    isLoading: peopleIsLoading,
    isSuccess: peopleIsSuccess,
  } = useGetAnagraphicDataQuery()
  let { data, isLoading, isSuccess } = useGetAdministeredQuery()

  totalData = useMemo(() => {
    if (!totalData) return
    else
      return totalData.data.map((el) => ({
        ...el,
        people: ageRangePeople[el.fascia_anagrafica],
      }))
  }, [totalData])
  console.log('ANAGRAPHIC TOTAL', totalData)

  const keys = [
    'prima_dose',
    'seconda_dose',
    'dose_booster',
    'dose_aggiuntiva',
    'fascia_anagrafica',
    'people',
    'totale',
  ]

  console.log('AGE REGIONS DATA BEFORE COMPUTING', data)

  const regions = [...Object.values(regionsData).map((el) => el.label), 'Total']

  const agesArr = ageRange.map((el) => ({
    fascia_anagrafica: el,
    prima_dose: 0,
    seconda_dose: 0,
    dose_booster: 0,
    dose_aggiuntiva: 0,
    people: 0,
    totale: 0,
  }))

  let defaultObj = regions.reduce((obj, el) => {
    if (el === 'Total') obj[el] = totalData
    else {
      const _agesArr = agesArr.map((el) => ({
        ...el,
        people: peopleData.find((el) => el.nome_area === el),
      }))

      obj[el] = _agesArr
    }
    return obj
  }, {})

  console.log('REGIONS', regions, 'AGES', agesArr, 'DEFAULT', defaultObj)

  const computedData = useMemo(() => {
    if (!data) return
    else {
      return data.data.reduce(
        (obj, el, i) => {
          if (obj[el.nome_area]) {
            const idx = obj[el.nome_area].findIndex(
              (el2) => el2.fascia_anagrafica === el.fascia_anagrafica,
            )
            if (i <= 5) {
              console.log(obj, el, idx, obj[el.nome_area][idx])
            }
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

  console.log('ANAGRAPHIC REGIONS AGE COMPUTED DATA', computedData)

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

export const useAnagraphicRegionsData = () => {
  let { data, isLoading, isSuccess } = useGetAdministeredQuery()
  const keys = [
    'prima_dose',
    'seconda_dose',
    'dose_booster',
    'dose_aggiuntiva',
    'fascia_anagrafica',
    'people',
    'totale',
  ]

  console.log('AGE REGIONS DATA BEFORE COMPUTING', data)

  const regions = Object.values(regionsData).map((el) => el.label)

  const agesArr = ageRange.map((el) => ({
    fascia_anagrafica: el,
    prima_dose: 0,
    seconda_dose: 0,
    dose_booster: 0,
    dose_aggiuntiva: 0,
    people: 0,
    totale: 0,
  }))

  let defaultObj = regions.reduce((obj, el) => {
    obj[el] = [...agesArr]
    return obj
  }, {})

  console.log('REGIONS', regions, 'AGES', agesArr, 'DEFAULT', defaultObj)

  const computedData = useMemo(() => {
    if (!data) return
    else {
      return data.data.reduce(
        (obj, el, i) => {
          if (obj[el.nome_area]) {
            const idx = obj[el.nome_area].findIndex(
              (el2) => el2.fascia_anagrafica === el.fascia_anagrafica,
            )
            if (i <= 5) {
              console.log(obj, el, idx, obj[el.nome_area][idx])
            }
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

  console.log('ANAGRAPHIC REGIONS AGE COMPUTED DATA', computedData)

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
  console.log(
    ' ADMINISTRATIONS SUMMARY ',
    isLoading,
    firstDoseTotal,
    secondDoseTotal,
  )

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
  console.log('COMPUTED DATA SUPPLIER / DATE', computedData)
  return {
    data: {
      data: computedData,
      brands,
    },
    isLoading,
    isSuccess,
  }
}

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
  console.log('COMPUTED DATA SUPPLIER / DATE', computedData)
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
