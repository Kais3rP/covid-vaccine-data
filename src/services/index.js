import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const covidApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      'https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/',
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (name) => `vaccini-summary-latest.json`,
    }),
    getAnagraphicData: builder.query({
      query: (name) => `anagrafica-vaccini-summary-latest.json`,
    }),
    getAdministeredSummary: builder.query({
      query: (name) => `somministrazioni-vaccini-summary-latest.json`,
    }),
    getAdministered: builder.query({
      query: (name) => `somministrazioni-vaccini-latest.json`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAdministeredQuery,
  useGetAdministeredSummaryQuery,
  useGetSummaryQuery,
  useGetAnagraphicDataQuery,
} = covidApi
