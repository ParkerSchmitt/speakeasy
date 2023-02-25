import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface ConfigInterface {
  NODE_ENV: string
  ACCOUNT_TABLE_NAME: string
  TOPIC_TABLE_NAME: string
  CARD_ACCOUNT_LINKAGE_NAME: string
  CARD_TABLE_NAME: string
  MAX_CARDS: number
  API_PORT: number
  CORS: boolean
  CORS_ORIGIN: string
  CORS_CREDENTIALS: boolean
  CORS_OPTIONS_SUCCESS_STATUS: number
  SESSION_SECRET: string
  SESSION_RESAVE: boolean
  SESSION_COOKIE_MAX_AGE: number
  SESSION_SAVE_UNINITALIZED: boolean
}
// Loading process.env as ENV interface
const getConfig = (): Partial<ConfigInterface> => {
  return {
    NODE_ENV: String(process.env.NODE_ENV),
    ACCOUNT_TABLE_NAME: String(process.env.ACCOUNT_TABLE_NAME),
    TOPIC_TABLE_NAME: String(process.env.TOPIC_TABLE_NAME),
    CARD_ACCOUNT_LINKAGE_NAME: String(process.env.CARD_ACCOUNT_LINKAGE_NAME),
    CARD_TABLE_NAME: String(process.env.CARD_TABLE_NAME),
    MAX_CARDS: Number(process.env.MAX_CARDS),
    API_PORT: Number(process.env.API_PORT),
    CORS: Boolean(process.env.CORS),
    CORS_ORIGIN: String(process.env.CORS_ORIGINAL),
    CORS_CREDENTIALS: Boolean(process.env.CORS_CREDENTIALS),
    CORS_OPTIONS_SUCCESS_STATUS: Number(process.env.OPTIONS_SUCCESS_STATUS),
    SESSION_SECRET: String(process.env.SESSION_SECRET),
    SESSION_RESAVE: Boolean(process.env.SESSION_RESAVE),
    SESSION_COOKIE_MAX_AGE: Number(process.env.SESSION_COOKIE_MAX_AGE),
    SESSION_SAVE_UNINITALIZED: Boolean(process.env.SESSION_SAVE_UNINITALIZED)
  }
}
// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
const getSanitzedConfig = (env: Partial<ConfigInterface>): ConfigInterface => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config file`)
    }
  }
  return env as ConfigInterface
}

const envConfig = getConfig()
const Config = getSanitzedConfig(envConfig)

export default Config
