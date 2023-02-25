import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './frontend/index.css'
import Router from './frontend/Router'

const rootElem: HTMLElement | null = document.getElementById('root')

if (rootElem !== null) {
  const root = ReactDOM.createRoot(rootElem)
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </React.StrictMode>
  )
} else {
  throw new Error("Can't find root element.")
}
