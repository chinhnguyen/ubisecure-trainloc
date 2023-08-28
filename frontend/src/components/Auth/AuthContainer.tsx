import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { Outlet } from 'react-router-dom'
import './AuthContainer.scss'

const AuthContainer = () => {
  return (
    <Authenticator signUpAttributes={['email']} loginMechanisms={['username']}>
      {() => (
        <Authenticator.Provider>
          <Outlet />
        </Authenticator.Provider>
      )}
    </Authenticator>
  )
}

export default AuthContainer
