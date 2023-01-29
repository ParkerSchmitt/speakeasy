import './App.css'
import React, { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageLogin from './pages/PageLogin'
import PageRegister from './pages/PageRegister'

function Router (): ReactElement {
  return (
    <Routes>
      <Route path="/login" element={ <PageLogin /> } />
      <Route path="/register" element={ <PageRegister /> } />

    </Routes>
  )
}

export default Router
