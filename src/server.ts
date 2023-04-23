import cors from 'cors'
import express from 'express'
import session from 'express-session'

import { Database } from 'sqlite3'
import AccountMediator from './backend/mediators/AccountMediator'
import AccountController from './backend/controllers/AccountController'
import AccountRepository from './backend/repositories/AccountRepository'
import TopicController from './backend/controllers/TopicController'
import TopicMediator from './backend/mediators/TopicMediator'
import TopicRepository from './backend/repositories/TopicRepository'
import { type CardAccountType } from './backend/types/CardAccountType'
import Config from './backend/Config'
console.log(process.env) // remove this after you've confirmed it is working

export const app = express()

declare module 'express-session' {
  interface SessionData {
    accountId: number
    activeReviews: Record<string, CardAccountType[]> // topic: string, Cards to review: CardType[]:
  }
}

app.use(session({
  secret: Config.SESSION_SECRET,
  resave: Config.SESSION_RESAVE,
  cookie: { maxAge: Config.SESSION_COOKIE_MAX_AGE },
  saveUninitialized: Config.SESSION_SAVE_UNINITALIZED
}))

const corsOptions = {
  origin: Config.CORS_ORIGIN,
  credentials: Config.CORS_CREDENTIALS,
  optionsSuccessStatus: Config.CORS_OPTIONS_SUCCESS_STATUS // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(express.json())

app.use((req: any, res: { set: (arg0: string, arg1: string) => void }, next: () => void) => {
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  next()
})

const database = new Database('./src/storage.db', (err) => {
  if (err != null) {
    console.error(err.message)
  }
})

const accountController = new AccountController({
  Mediator: new AccountMediator({
    Repository: new AccountRepository({
      tableName: Config.ACCOUNT_TABLE_NAME,
      database
    })
  })
})

const topicsController = new TopicController({
  Mediator: new TopicMediator({
    MaxCards: Config.MAX_CARDS,
    Repository: new TopicRepository({
      topicTableName: Config.TOPIC_TABLE_NAME,
      cardAccountLinkageTableName: Config.CARD_ACCOUNT_LINKAGE_NAME,
      cardTableName: Config.CARD_TABLE_NAME,
      cardReportTableName: Config.CARD_REPORT_TABLE_NAME,
      database
    })
  })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/register', accountController.PostReceiveSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/authenticate', accountController.PostReceiveSignin)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/isAuthenticated', accountController.GetIsAuthenticated)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/topics', topicsController.GetReceiveTopics)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/topics/:topicName/percentage', topicsController.GetReceiveTopicsPercentage)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/topics/:topicName/practice', topicsController.GetReceiveTopicsPractice)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/retrieveCards', topicsController.PostReceiveCards)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/saveCard', topicsController.PostSaveCard)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/reportCard', topicsController.PostReportCard)

// start the Express server
app.listen(Config.API_PORT, () => {
  console.log(`API server running on ${Config.API_PORT}`)
})
