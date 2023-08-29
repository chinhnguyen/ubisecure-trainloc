import User from '../models/User'
import { restApi } from '.'

const userApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, string>({
      query: () => '/users/current'
    })
  })
})

export const { useLazyGetCurrentUserQuery } = userApi
