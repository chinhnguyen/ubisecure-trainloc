import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { restApi } from '../apis'
import { authReducer } from './Auth'

const store = configureStore({
  reducer: {
    auth: authReducer,
    [restApi.reducerPath]: restApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const reduxStore = store
