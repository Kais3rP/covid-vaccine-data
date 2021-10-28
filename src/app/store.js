import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { covidApi } from '../services'
import mapReducer from '../features/italymap/map.slice.js'
import graphsReducer from '../features/graphs/graphs.slice.js'

export const store = configureStore({
  reducer: {
    [covidApi.reducerPath]: covidApi.reducer,
    map: mapReducer,
    graphs: graphsReducer,
  },
  middleWare: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(covidApi.middleware),
})
