import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { Database } from 'sqlite3'
import AccountMediator from './backend/mediators/AccountMediator'
import AccountController from './backend/controllers/AccountController'
import AccountRepository from './backend/repositories/AccountRepository'

export const app = express()
app.use(session({
  secret: 'TEST',
  resave: false,
  saveUninitialized: false
}))
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  next()
})

const signUpController = new AccountController({
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
app.post('/register', signUpController.PostReceiveSignup)
app.post('/', (req, res) => {
  res.send('POST Request Called')
})
// start the Express server
app.listen(4000, () => {
  console.log(`server running on ${4000}`)
})
