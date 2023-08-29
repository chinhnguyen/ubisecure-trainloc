import { Alert, Box, Button, TextField } from '@mui/material'
import { useCurrentUser, useUpdateUserInfo } from '../../hooks/SessionHooks'
import './Account.scss'
import { useEffect, useState } from 'react'
import User from '../../models/User'

function Account() {
  const currentUser = useCurrentUser()
  const [user, setUser] = useState(new User())
  const { updateUserInfo, isUpdating, isError, error } = useUpdateUserInfo()

  useEffect(() => setUser({ ...currentUser } as User), [currentUser])

  return (
    <Box className="account">
      <TextField
        id="outlined-basic"
        label="Username"
        variant="outlined"
        value={user?.username}
        disabled={true}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          readOnly: true
        }}
      />
      <TextField
        id="outlined-basic"
        label="First Name"
        variant="outlined"
        value={user?.firstName}
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
      />

      <TextField
        id="outlined-basic"
        label="Last Name"
        variant="outlined"
        value={user?.lastName}
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
      />

      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={user?.email}
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      {isError && (
        <Alert severity="error">
          {error?.message || 'Error saving user information.'}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={() => updateUserInfo(user)}
        disabled={isUpdating}
      >
        Save changes
      </Button>
    </Box>
  )
}

export default Account
