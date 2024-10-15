import './App.css'
import React, { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageIndex from './pages/PageIndex'

function Router (): ReactElement {
  return (
    <Routes>
      <Route path="/" element={ <PageIndex /> } />
    </Routes>
  )
}

export default Router
