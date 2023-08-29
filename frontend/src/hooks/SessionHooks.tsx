import { useAuthenticator } from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { clearCurrentUser, setCurrentUser, setToken } from '../store/Auth'
import User from '../models/User'
import { useLazyGetCurrentUserQuery } from '../apis/UsersApi'
import { Auth } from 'aws-amplify'

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

export const useCurrentUser = (): User | undefined => {
  const currentUser = useSelector<RootState>(
    (state) => state.auth.currentUser
  ) as User
  return currentUser
}

export const useSignOut = () => {
  const dispatch = useDispatch()
  const { signOut } = useAuthenticator()
  return async () => {
    try {
      signOut()
      dispatch(clearCurrentUser())
    } catch (e) {
      console.error(e)
    }
  }
}

export const useUpdateUserInfo = () => {
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  const updateUserInfo = async (user: User) => {
    try {
      setIsUpdating(true)
      const cognitoUser = await Auth.currentAuthenticatedUser()
      await Auth.updateUserAttributes(cognitoUser, {
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.email
      })
      dispatch(setCurrentUser(user))
    } catch (e) {
      setIsError(true)
      setError(e as Error)
    } finally {
      setIsUpdating(false)
    }
  }
  return { updateUserInfo, isUpdating, isError, error }
}
