import cors from 'cors'
import express from 'express'
import session from 'express-session'

import { Database } from 'sqlite3'
import AccountMediator from './backend/mediators/AccountMediator'
import AccountController from './backend/controllers/AccountController'
import AccountRepository from './backend/repositories/AccountRepository'

export const app = express()

const oneDay = 1000 * 60 * 60 * 24

declare module 'express-session' {
  interface SessionData {
    email: string
  }
}

app.use(session({
  secret: 'TEST',
  resave: false,
  cookie: { maxAge: oneDay },
  saveUninitialized: true
}))

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(express.json())

app.use((req, res, next) => {
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  next()
})

const accountController = new AccountController({
  Mediator: new AccountMediator({
    Repository: new AccountRepository({
      tableName: 'accounts',
      database: new Database('./src/storage.db', (err) => {
        if (err != null) {
          console.error(err.message)
        }
      })
    })
  })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/register', accountController.PostReceiveSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/authenticate', accountController.PostReceiveSignin)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/isAuthenticated', accountController.GetIsAuthenticated)

// start the Express server
app.listen(4000, () => {
  console.log(`server running on ${4000}`)
})
