import './App.css'
import React, { type ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageLogin from './pages/PageLogin'
import PageRegister from './pages/PageRegister'
import PageTopics from './pages/PageTopics'
// import { ProtectedRoute } from './components/ProtectedRoute'
import PageLearn from './pages/PageLearn'
import PageIndex from './pages/PageIndex'
import PageVerifyAccount from './pages/PageVerifyAccountAlert'
import PageVerifyAccountSender from './pages/PageVerifyAccountSender'

function Router (): ReactElement {
  return (
    <Routes>
      <Route path="/" element={ <PageIndex /> } />
      <Route path="/login" element={ <PageLogin /> } />
      <Route path="/register" element={ <PageRegister /> } />
      <Route path="/account/verify/:token" element={<PageVerifyAccountSender/>} />
      <Route path="/account/verify/" element={<PageVerifyAccount/>} />
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
