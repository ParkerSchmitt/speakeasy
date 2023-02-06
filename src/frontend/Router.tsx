import './App.css'
import React, { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageLogin from './pages/PageLogin'
import PageRegister from './pages/PageRegister'
import PageTopics from './pages/PageTopics'
// import { ProtectedRoute } from './components/ProtectedRoute'
import PageLearn from './pages/PageLearn'

function Router (): ReactElement {
  return (
    <Routes>
      <Route path="/login" element={ <PageLogin /> } />
      <Route path="/register" element={ <PageRegister /> } />
        <Route path="/topics" element={
    //      <ProtectedRoute>
            <PageTopics/>
    //      </ProtectedRoute>
        }>
        </Route>
        <Route path="/learn" element={
       //   <ProtectedRoute>
            <PageLearn/>
     //     </ProtectedRoute>
        }>
        </Route>
    </Routes>
  )
}

export default Router
