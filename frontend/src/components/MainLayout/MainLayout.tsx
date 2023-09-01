import React, { useEffect, useState } from 'react'

import {
  AppBar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
  Menu,
  LinearProgress,
  Alert
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import { TypedRoute } from '../../models/TypedRoute'
import { useLoadCurrentUser, useSignOut } from '../../hooks/SessionHooks'

const titles = {
  [TypedRoute.Home]: 'Home',
  [TypedRoute.Account]: 'Account',
  [TypedRoute.Trains]: 'Train List'
}

function MainLayout() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { isLoading: isLoadingUser, isError: errorLoadingUser } =
    useLoadCurrentUser()

  const signOut = useSignOut()

  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState<string>('')
  useEffect(() => {
    setTitle(titles[location.pathname as TypedRoute])
  }, [location])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    signOut()
  }

  const handleAccount = () => {
    navigate(TypedRoute.Account)
    setAnchorEl(null)
  }

  const handleTrainsList = () => {
    navigate(TypedRoute.Trains)
    setAnchorEl(null)
  }

  const [searchParams] = useSearchParams()
  useEffect(() => {
    if (searchParams.get('action') === 'signup') {
      signOut()
    }
  }, [searchParams])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
            disabled={isLoadingUser}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleTrainsList}>Trains List</MenuItem>
            <MenuItem onClick={handleAccount}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {isLoadingUser === true && <LinearProgress />}
      {errorLoadingUser === true && (
        <Alert severity="error">
          Error loading user. You might need to logout and login again to solve
          the problem.
        </Alert>
      )}
      <Outlet />
    </Box>
  )
}

export default MainLayout
