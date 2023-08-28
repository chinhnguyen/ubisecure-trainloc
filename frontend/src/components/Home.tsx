import React from 'react'
import logo from '../logo.svg'
import './Home.scss'
import { Button } from '@mui/material'

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
      <Button variant="contained">Hello world</Button>
        <img src={logo} className="Home-logo" alt="logo" />
        <p>
          Edit <code>src/Home.tsx</code> and save to reload.
        </p>
        <a
          className="Home-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default Home
