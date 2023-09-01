import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography
} from '@mui/material'
import { useCurrentUser, useUpdateUserInfo } from '../../hooks/SessionHooks'
import './Account.scss'
import { useEffect, useState } from 'react'
import User from '../../models/User'
import { useInviteUserMutation } from '../../apis/UsersApi'
import UserInvitation from '../../models/UserInvitation'

function Account() {
  const currentUser = useCurrentUser()
  const [user, setUser] = useState(new User())
  const {
    updateUserInfo,
    isUpdating: isUpdatingUserInfo,
    isError: isErrorUpdatingUserInfo,
    error: errorUpdatingUserInfo
  } = useUpdateUserInfo()
  useEffect(() => setUser({ ...currentUser } as User), [currentUser])

  const [invitation, setInvitation] = useState(new UserInvitation())
  const [
    inviteUser,
    {
      isLoading: isSendingInvitation,
      isError: isErrorSendingInvitation,
      error: errorSendingInvitation
    }
  ] = useInviteUserMutation()

  return (
    <Box className="account">
      <Typography variant="h5">Your info</Typography>
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

      {isErrorUpdatingUserInfo && (
        <Alert severity="error">
          {errorUpdatingUserInfo?.message || 'Error saving user information.'}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={() => updateUserInfo(user)}
        disabled={isUpdatingUserInfo}
      >
        Save changes
      </Button>

      <Divider />
      <Typography variant="h5">Invite a friend</Typography>
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={invitation.email}
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) =>
          setInvitation({ ...invitation, email: e.target.value })
        }
      />
      {isErrorSendingInvitation && (
        <Alert severity="error">
          {(errorSendingInvitation as any)?.message ||
            'Error sending invitation.'}
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={() => inviteUser(invitation)}
        disabled={isSendingInvitation || invitation.email.length === 0}
      >
        Invite
      </Button>
    </Box>
  )
}

export default Account
