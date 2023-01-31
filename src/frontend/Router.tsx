import './App.css'
import React, { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageLogin from './pages/PageLogin'
import PageRegister from './pages/PageRegister'
import PageTopics from './pages/PageTopics'
import { ProtectedRoute } from './components/ProtectedRoute'

function Router (): ReactElement {
  return (
    <Routes>
      <Route path="/login" element={ <PageLogin /> } />
      <Route path="/register" element={ <PageRegister /> } />
        <Route path="/topics" element={
          <ProtectedRoute>
            <PageTopics/>
          </ProtectedRoute>
        }>
        </Route>
    </Routes>
  )
}

export default Router
