import React, { useEffect, useState } from 'react'

import {
  AppBar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
  Menu
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useCurrentUser } from '../Auth/AuthHooks'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TypedRoute } from '../../models/TypedRoute'

const titles = {
  [TypedRoute.Home]: 'Home',
  [TypedRoute.Account]: 'Account',
  [TypedRoute.Trains]: 'Train List'
}

function MainLayout() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [_, signOut] = useCurrentUser()

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
            <MenuItem onClick={handleAccount}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  )
}

export default MainLayout
