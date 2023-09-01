import User from '../models/User'
import { restApi } from '.'
import UserInvitation from '../models/UserInvitation'

const userApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/current'
    }),
    inviteUser: builder.mutation<void, UserInvitation>({
      query: (invitation) => ({
        url: `/users/current/invites`,
        method: 'POST',
        body: invitation
      })
    })
  })
})

export const { useLazyGetCurrentUserQuery, useInviteUserMutation } = userApi
