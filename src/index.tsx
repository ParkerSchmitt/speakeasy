import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './frontend/index.css'
import Router from './frontend/Router'
import express from 'express'
import path from 'path'
import config from './config'
import session from 'express-session';
import cors from 'cors'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  </React.StrictMode>
)

export const app = express()
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
app.use(cors())
app.use(express.json())


app.use((req, res, next) => {
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Cross-Origin-Opener-Policy","same-origin-allow-popups")
  next();
});



const signUpController = new SignupController({
  Mediator: new SignupMediator({
    Repository: new SignupRepository({
      Client: new Client({
        user: 'test',
        host: 'localhost',
        database: 'postgres',
        password: 'test',
        port: 5432,
      }),
      TableName: "users"
    })
  })
})


app.post('/register', signUpController.PostReceiveEmail);

// start the Express server
app.listen( config.PORT, () => {
    // tslint:disable-next-line:no-console
    console.log( `server running on ${config.PORT}` );
});