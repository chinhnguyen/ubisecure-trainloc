import { useAuthenticator } from '@aws-amplify/ui-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { clearCurrentUser, setCurrentUser, setToken } from '../store/Auth'
import User from '../models/User'
import { useLazyGetCurrentUserQuery } from '../apis/UsersApi'

export const useLoadCurrentUser = (): {
  currentUser: User | undefined
  isLoading: boolean
  isError: boolean
} => {
  const dispatch = useDispatch()
  const [getCurrentUser, { isLoading, isError }] = useLazyGetCurrentUserQuery()
  const { user: cognitoUser } = useAuthenticator()
  const currentUser = useSelector<RootState>(
    (state) => state.auth.currentUser
  ) as User

  useEffect(() => {
    const run = async () => {
      const token = cognitoUser
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()
      if (token) {
        dispatch(setToken(token))
        const { data: user } = await getCurrentUser(token)
        if (user) {
          dispatch(setCurrentUser(user))
        }
      }
    }
    run()
  }, [cognitoUser, getCurrentUser, dispatch])

  return { currentUser, isLoading, isError }
}

export const useCurrentUser = (): {
  currentUser: User | undefined
  signOut: () => Promise<void>
} => {
  const currentUser = useSelector<RootState>(
    (state) => state.auth.currentUser
  ) as User
  const dispatch = useDispatch()
  const { signOut } = useAuthenticator()
  return {
    currentUser,
    signOut: async () => {
      dispatch(clearCurrentUser())
      signOut()
    }
  }
}
