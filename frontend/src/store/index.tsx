import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { restApi } from '../apis'
import { authReducer } from './Auth'
import { liveTrainsReducer } from './LiveTrains'

const store = configureStore({
  reducer: {
    auth: authReducer,
    liveTrains: liveTrainsReducer,
    [restApi.reducerPath]: restApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const reduxStore = store
