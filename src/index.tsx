import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './frontend/index.css'
import Router from './frontend/Router'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  </React.StrictMode>
)
