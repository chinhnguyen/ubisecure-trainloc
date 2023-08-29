import React from 'react'
import './App.scss'
import Home from './components/NotFound'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthContainer from './components/Auth/AuthContainer'

import './components/Auth/AuthConfig'
import MainLayout from './components/MainLayout/MainLayout'
import Account from './components/Account/Account'
import { TypedRoute } from './models/TypedRoute'
import NotFound from './components/NotFound'
import TrainsView from './components/TrainsView/TrainsView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
