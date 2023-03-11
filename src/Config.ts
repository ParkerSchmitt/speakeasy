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
  CARD_REPORT_TABLE_NAME: string
  SQL_CLIENT: string
  SQL_HOST: string
  SQL_PORT: number
  SQL_USER: string
  SQL_PASSWORD: string
  SQL_DATABASE: string
  SQL_FILENAME: string
  MAX_CARDS: number
  API_PORT: number
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
    NODE_ENV: (process.env.NODE_ENV != null) ? String(process.env.NODE_ENV) : undefined,
    ACCOUNT_TABLE_NAME: (process.env.ACCOUNT_TABLE_NAME != null) ? String(process.env.ACCOUNT_TABLE_NAME) : undefined,
    TOPIC_TABLE_NAME: (process.env.TOPIC_TABLE_NAME != null) ? String(process.env.TOPIC_TABLE_NAME) : undefined,
    CARD_ACCOUNT_LINKAGE_NAME: (process.env.CARD_ACCOUNT_LINKAGE_NAME != null) ? String(process.env.CARD_ACCOUNT_LINKAGE_NAME) : undefined,
    CARD_TABLE_NAME: (process.env.CARD_TABLE_NAME != null) ? String(process.env.CARD_TABLE_NAME) : undefined,
    CARD_REPORT_TABLE_NAME: (process.env.CARD_REPORT_TABLE_NAME != null) ? String(process.env.CARD_REPORT_TABLE_NAME) : undefined,
    SQL_CLIENT: (process.env.SQL_CLIENT != null) ? String(process.env.SQL_CLIENT) : undefined,
    SQL_HOST: (process.env.SQL_HOST != null) ? String(process.env.SQL_HOST) : undefined,
    SQL_PORT: (process.env.SQL_PORT != null) ? Number(process.env.SQL_PORT) : undefined,
    SQL_USER: (process.env.SQL_USER != null) ? String(process.env.SQL_USER) : undefined,
    SQL_PASSWORD: (process.env.SQL_PASSWORD != null) ? String(process.env.SQL_PASSWORD) : undefined,
    SQL_DATABASE: (process.env.SQL_DATABASE != null) ? String(process.env.SQL_DATABASE) : undefined,
    SQL_FILENAME: (process.env.SQL_FILENAME != null) ? String(process.env.SQL_FILENAME) : undefined,
    MAX_CARDS: (process.env.MAX_CARDS != null) ? Number(process.env.MAX_CARDS) : undefined,
    API_PORT: (process.env.API_PORT != null) ? Number(process.env.API_PORT) : undefined,
    CORS_ORIGIN: (process.env.CORS_ORIGIN != null) ? String(process.env.CORS_ORIGIN) : undefined,
    CORS_CREDENTIALS: (process.env.CORS_CREDENTIALS != null) ? Boolean(process.env.CORS_CREDENTIALS) : undefined,
    CORS_OPTIONS_SUCCESS_STATUS: (process.env.CORS_OPTIONS_SUCCESS_STATUS != null) ? Number(process.env.CORS_OPTIONS_SUCCESS_STATUS) : undefined,
    SESSION_SECRET: (process.env.SESSION_SECRET != null) ? String(process.env.SESSION_SECRET) : undefined,
    SESSION_RESAVE: (process.env.SESSION_RESAVE != null) ? Boolean(process.env.SESSION_RESAVE) : undefined,
    SESSION_COOKIE_MAX_AGE: (process.env.SESSION_COOKIE_MAX_AGE != null) ? Number(process.env.SESSION_COOKIE_MAX_AGE) : undefined,
    SESSION_SAVE_UNINITALIZED: (process.env.SESSION_SAVE_UNINITALIZED != null) ? Boolean(process.env.SESSION_SAVE_UNINITALIZED) : undefined
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
