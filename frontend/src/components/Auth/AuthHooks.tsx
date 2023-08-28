import { useAuthenticator } from '@aws-amplify/ui-react'
import User from '../../models/User'

export const useCurrentUser = (): [User | undefined, () => Promise<void>] => {
  // const currentUser = useSelector<RootState>((state) => state.auth.currentUser)
  // const dispatch = useDispatch()
  const { signOut } = useAuthenticator()
  return [
    undefined, //currentUser as User,
    async () => {
      // dispatch(clearCurrentUser())
      signOut()
    }
  ]
}
