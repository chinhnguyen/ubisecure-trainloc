import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

console.log(process.env)
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: () => ({})
})

export const { reducerPath, reducer, middleware } = api
export const restApi = api
