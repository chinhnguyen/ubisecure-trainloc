import { useCurrentUser } from "../../hooks/SessionHooks"

function Account() {
  const { currentUser } = useCurrentUser()
  return <h1>{currentUser?.firstName}</h1>
}

export default Account
