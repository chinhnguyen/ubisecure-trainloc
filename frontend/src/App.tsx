import React from 'react'
import './App.scss'
import Home from './components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthContainer from './components/Auth/AuthContainer'

import './components/Auth/AuthConfig'
import MainLayout from './components/MainLayout/MainLayout'
import Account from './components/Account/Account'
import { TypedRoute } from './models/TypedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthContainer />}>
          <Route element={<MainLayout />}>
            <Route path={TypedRoute.Home} element={<Home />} />
            <Route path={TypedRoute.Account} element={<Account />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
