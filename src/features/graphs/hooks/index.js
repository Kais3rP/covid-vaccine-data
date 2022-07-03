import {
  useGetAdministeredQuery,
  useGetAdministeredSummaryQuery,
  useGetAdministrationSitesQuery,
  useGetAnagraphicDataQuery,
  useGetAnagraphicPopulationDataQuery,
  useGetSummaryQuery,
  useGetSuppliedQuery,
} from "../../../services";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import {
  sumObjectsByKey,
  sumObjectsByKeyAndType,
  sumObjectsByKeyInclusive,
  sumObjectsByKeySelective,
} from "../../../utils";
import { KeyboardReturnRounded, LegendToggle } from "@mui/icons-material";
import {
  ageRange,
  ageRangePeople,
  anagraphicKeys,
  brands,
  regions,
  regions2,
  regionsData,
} from "../../../data";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const totalPopulation = 59500000;
const under12 = 6024595;
const over12 = totalPopulation - under12;

export const useTotalDelivered = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery();

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT

  const total = useMemo(() => {
    if (!data) return;
    else
      return data.data
        .reduce((acc, curr) => acc + curr.dosi_consegnate, 0)
        .toLocaleString("en-US");
  }, [data]);

  return { data: total, isLoading };
};

export const useTotalAdministrations = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery();

  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT
  const total = useMemo(() => {
    if (!data) return;
    else
      return data.data
        .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
        .toLocaleString("en-US");
  }, [data]);

  return { data: total, isLoading };
};

export const useAnagraphicData = () => {
  /**
   *
   *  CONSTANTS
   *
   */

  const regions = useMemo(
    () => [...Object.values(regionsData).map((el) => el.label), "Total"],
    []
  );

  /**
   *
   *  QUERIES
   *
   */

  let {
    data: totalData,
    isLoading: totalIsLoading,
    isSuccess: totalIsSuccess,
  } = useGetAnagraphicDataQuery();

  let {
    data: peopleData,
    isLoading: peopleIsLoading,
    isSuccess: peopleIsSuccess,
  } = useGetAnagraphicPopulationDataQuery();
  let { data, isLoading, isSuccess } = useGetAdministeredQuery();

  /**
   *
   *  MANIPULATED DATA
   *
   */

  totalData = useMemo(() => {
    if (!totalData) return;
    else
      return totalData.data
        .map((el, i) =>
          i === 8
            ? sumObjectsByKeyInclusive(
                {
                  ...el,
                  eta: "80+",
                  people: ageRangePeople["80+"],
                },
                totalData.data[i + 1]
              )
            : {
                ...el,
                people: ageRangePeople[el.eta],
              }
        )
        .filter((el, i) => i !== 9);
  }, [totalData]);

  const agesArr = useMemo(
    () =>
      ageRange.map((el) => ({
        eta: el,
        d1: 0,
        d2: 0,
        db1: 0,
        db2: 0,
        people: 0,
        totale: 0,
      })),
    []
  );

  /*   let defaultObj = useMemo(
    () =>
      peopleData && totalData
        ? regions.reduce((obj, el) => {
            if (el === "Total") obj[el] = totalData;
            else {
              const _agesArr = agesArr.map((el2) => ({
                ...el2,
                people: peopleData.data.find((el3) => {
                  return (
                    (el === "Provincia Autonoma Trento"
                      ? el3.reg === "P.A. Trento"
                      : el === "Valle d'Aosta / Vallée d'Aoste"
                      ? el3.reg === "Valle d'Aosta"
                      : el === el3.reg) && el3.eta === el2.eta
                  );
                })?.totale_popolazione,
              }));
              obj[el] = _agesArr;
            }
            return obj;
          }, {})
        : null,
    [peopleData, totalData, agesArr, regions]
  ); */

  const computedData = useMemo(() => {
    let defaultObj =
      peopleData && totalData
        ? regions.reduce((obj, el) => {
            if (el === "Total") obj[el] = totalData;
            else {
              const _agesArr = agesArr.map((el2) => ({
                ...el2,
                people: peopleData.data.find((el3) => {
                  return (
                    (el === "Provincia Autonoma Trento"
                      ? el3.reg === "P.A. Trento"
                      : el === "Valle d'Aosta / Vallée d'Aoste"
                      ? el3.reg === "Valle d'Aosta"
                      : el === el3.reg) && el3.eta === el2.eta
                  );
                })?.totale_popolazione,
              }));
              obj[el] = _agesArr;
            }
            return obj;
          }, {})
        : null;

    if (!data || !defaultObj) return;
    else {
      return data.data.reduce(
        (obj, el, i) => {
          if (obj[el.reg]) {
            const idx = obj[el.reg].findIndex((el2) => {
              return el.eta === "80-89" || el.eta === "90+"
                ? el2.eta === "80+"
                : el2.eta === el.eta;
            });

            if (obj[el.reg][idx]) {
              obj[el.reg][idx].totale += el.d1 + el.d2 + el.db1 + el.db2;
              obj[el.reg][idx] = sumObjectsByKeySelective(
                anagraphicKeys,
                obj[el.reg][idx],
                el
              );
            }
          }
          return obj;
        },
        { ...defaultObj }
      );
    }
  }, [data, peopleData, totalData, agesArr, regions]);

  return {
    data: {
      data: computedData,
      doseTypes: [
        { key: "people", label: "Total" },
        { key: "d1", label: "First dose" },
        { key: "d2", label: "Second dose" },
        { key: "db1", label: "Third dose" },
        { key: "db2", label: "Fourth dose" },
      ],
    },
    isLoading,
    isSuccess,
  };
};

export const useAdministeredSummaryData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredSummaryQuery();

  const firstDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.d1, 0);
  }, [data]);

  /* const firstDosePlusNaturalImmunity = useMemo(() => {
    return data?.data.reduce(
      (acc, curr) => acc + curr.dpi,
      0
    );
  }, [data]); */

  const secondDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.d2, 0);
  }, [data]);

  /*  const secondDosePlusNaturalImmunity = useMemo(() => {
    return data?.data.reduce(
      (acc, curr) => acc + curr.d2 + curr.pregressa_infezione,
      0
    );
  }, [data]); */

  /* const additionalDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.dose_aggiuntiva, 0)
  }, [data]) */
  const thirdDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.db1, 0);
  }, [data]);

  const fourthDoseTotal = useMemo(() => {
    return data?.data.reduce((acc, curr) => acc + curr.db2, 0);
  }, [data]);

  return {
    data: data && {
      firstDose: {
        total: firstDoseTotal.toLocaleString("en-US"),
        percentageOnTotal: ((firstDoseTotal * 100) / totalPopulation).toFixed(
          0
        ),
        percentageOnOver12: ((firstDoseTotal * 100) / over12).toFixed(0),
      },
      secondDose: {
        total: secondDoseTotal.toLocaleString("en-US"),
        percentageOnTotal: ((secondDoseTotal * 100) / totalPopulation).toFixed(
          0
        ),
        percentageOnOver12: ((secondDoseTotal * 100) / over12).toFixed(0),
      },

      thirdDose: {
        total: thirdDoseTotal.toLocaleString("en-US"),
        percentageOnTotal: ((thirdDoseTotal * 100) / totalPopulation).toFixed(
          0
        ),
        percentageOnOver12: ((thirdDoseTotal * 100) / over12).toFixed(0),
      },
      fourthDose: {
        total: fourthDoseTotal.toLocaleString("en-US"),
        percentageOnTotal: ((fourthDoseTotal * 100) / totalPopulation).toFixed(
          0
        ),
        percentageOnOver12: ((fourthDoseTotal * 100) / over12).toFixed(0),
      },
    },
    isLoading,
    isSuccess,
  };
};

export const useAdministeredData = () => {
  const { data, isLoading, isSuccess } = useGetAdministeredQuery();

  const computedData = useMemo(() => {
    const defaultObj = {
      "Pfizer/BioNTech": 0,
      Moderna: 0,
      "Vaxzevria (AstraZeneca)": 0,
      Janssen: 0,
      "Pfizer Pediatrico": 0,
    };

    let prevDate;

    return (
      data &&
      Object.entries(
        Object.entries(
          data.data.reduce((obj, el) => {
            if (obj[el.data])
              obj[el.data][el.forn] += el.d1 + el.d2 + el.db1 + el.db2;
            else {
              const newObj = { ...defaultObj };
              newObj[el.forn] = el.d1 + el.d2 + el.db1 + el.db2;

              obj[el.data] = newObj;
            }
            return obj;
          }, {})
        ).reduce((obj, el, i) => {
          if (i === 0 || i % 7 === 0) {
            obj[el[0]] = el[1];
            prevDate = el[0];
          } else obj[prevDate] = sumObjectsByKey(obj[prevDate], el[1]);
          return obj;
        }, {})
      )
    );
  }, [data]);

  return {
    data: {
      data: computedData,
      brands,
    },
    isLoading,
    isSuccess,
  };
};

export const useSummaryData = () => {
  let { data, isLoading, isSuccess } = useGetSummaryQuery();
  // ADD EXTRA PROPS VALUES TO THE REGIONS OBJECT

  data = useMemo(() => {
    if (!data) return;
    else
      return {
        rows: [
          ...data.data.map((el) => ({
            id: el.index,
            region: el.reg,
            delivered: el.dosi_consegnate.toLocaleString("en-US"),
            administered: el.dosi_somministrate.toLocaleString("en-US"),
            percentage: el.percentuale_somministrazione + "%",
          })),
          {
            id: "total",
            region: "Total",
            administered: data.data
              .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
              .toLocaleString("en-US"),
            delivered: data.data
              .reduce((acc, curr) => acc + curr.dosi_consegnate, 0)
              .toLocaleString("en-US"),
            percentage:
              (
                data.data.reduce(
                  (acc, curr) => acc + curr.percentuale_somministrazione,
                  0
                ) / 21
              ).toFixed(1) + "%",
          },
        ],
        columns: [
          {
            field: "region",
            headerName: "Regions",
            headerClassName: "grid-header",
          },
          {
            field: "administered",
            headerName: "Administered Doses",
            headerClassName: "grid-header",
          },
          {
            field: "delivered",
            headerName: "Delivered Doses",
            headerClassName: "grid-header",
          },
          {
            field: "percentage",
            headerName: "%",
            headerClassName: "grid-header",
          },
        ],
      };
  }, [data]);
  return {
    data,
    isLoading,
    isSuccess,
  };
};

export const useSuppliedData = () => {
  const defaultObj = brands.reduce((o, curr) => {
    o[curr.key] = 0;
    return o;
  }, {});


  
  const { data, isLoading, isSuccess } = useGetSuppliedQuery();
  const computedData = useMemo(() => {
    if (!data) return;
    else {
      const temp = data.data.reduce((obj, el) => {
        obj[el.forn] += el.numero_dosi;
        return obj;
      }, defaultObj);
      return Object.entries({
        ...temp,
        total: Object.values(temp).reduce((sum, curr) => sum + curr, 0),
      });
    }
  }, [data]);


  
  return {
    data: {
      data: computedData.sort((a,b) => a.),
      brands,
    },
    isLoading,
  };
};

export const useAdministrationSitesData = () => {
  const { data, isLoading, isSuccess } = useGetAdministrationSitesQuery();

  const defaultObj = useMemo(() => {
    const obj = {};
    for (const region of regions)
      obj[region] = {
        total: 0,
      };
    return obj;
  }, []);

  const total = useMemo(() => {
    if (!data) return;
    else return data.data.length;
  }, [data]);

  const regionsData = useMemo(() => {
    if (!data) return;
    else
      return data.data.reduce((obj, curr) => {
        if (obj[curr.reg])
          obj[curr.reg] = {
            ...obj[curr.reg],
            total: obj[curr.reg].total + 1,
          };
        return obj;
      }, defaultObj);
  }, [data]);

  return {
    data: {
      total,
      regionsTotal: regionsData,
      list: {
        rows: data?.data.map((el) => ({
          id: el.index,
          region: el.reg,
          site: el.denominazione_struttura,
          type: el.tipologia,
        })),

        columns: [
          {
            field: "region",
            headerName: "Regions",
            headerClassName: "grid-header",
          },
          {
            field: "site",
            headerName: "Administration Site",
            headerClassName: "grid-header",
          },
          {
            field: "type",
            headerName: "Type",
            headerClassName: "grid-header",
          },
        ],
      },
    },
    isLoading,
    isSuccess,
  };
};
