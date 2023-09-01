import React from 'react'
import './App.scss'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthContainer from './components/Auth/AuthContainer'

import './components/Auth/AuthConfig'
import MainLayout from './components/MainLayout/MainLayout'
import Account from './components/Account/Account'
import { TypedRoute, UnprotectedRoute } from './models/TypedRoute'
import NotFound from './components/NotFound'
import TrainsView from './components/TrainsView/TrainsView'
import { Auth } from 'aws-amplify'

function SignUp() {
  Auth.signOut()
  return <Navigate replace to={TypedRoute.Home} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={UnprotectedRoute.SignUp} element={<SignUp />} />
        <Route element={<AuthContainer />}>
          <Route element={<MainLayout />}>
            <Route
              path={TypedRoute.Home}
              element={<Navigate replace to={TypedRoute.Trains} />}
            />
            <Route path={TypedRoute.Account} element={<Account />} />
            <Route path={TypedRoute.Trains} element={<TrainsView />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
