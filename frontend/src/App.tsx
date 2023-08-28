import React from 'react'
import './App.scss'
import Home from './components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthContainer from './components/Auth/AuthContainer'

import './components/Auth/AuthConfig'

export enum TypedRoute {
  Home = '/'
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthContainer />}>
          <Route path={TypedRoute.Home} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
