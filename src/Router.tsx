import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PageLogin from './PageLogin'
function Router () {
  return (
    <Routes>
      <Route path="/login" element={ <PageLogin /> } />
    </Routes>
  )
}

export default Router
