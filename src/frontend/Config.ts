// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface ConfigInterface {
  NODE_ENV: string
  REACT_APP_MEDIA_URL: string
  REACT_APP_API_URL: string
  REACT_APP_MAX_CARDS: number
  REACT_APP_DEFAULT_CARDS: number
  REACT_APP_SETTING_DEBOUNCE_MILLIS: number
}
// Loading process.env as ENV interface
const getConfig = (): Partial<ConfigInterface> => {
  return {
    NODE_ENV: (process.env.NODE_ENV != null) ? String(process.env.NODE_ENV) : undefined,
    REACT_APP_MEDIA_URL: (process.env.REACT_APP_MEDIA_URL != null) ? String(process.env.REACT_APP_MEDIA_URL) : undefined,
    REACT_APP_API_URL: (process.env.REACT_APP_API_URL != null) ? String(process.env.REACT_APP_API_URL) : undefined,
    REACT_APP_MAX_CARDS: (process.env.REACT_APP_MAX_CARDS != null) ? Number(process.env.REACT_APP_MAX_CARDS) : undefined,
    REACT_APP_DEFAULT_CARDS: (process.env.REACT_APP_DEFAULT_CARDS != null) ? Number(process.env.REACT_APP_DEFAULT_CARDS) : undefined,
    REACT_APP_SETTING_DEBOUNCE_MILLIS: (process.env.REACT_APP_SETTING_DEBOUNCE_MILLIS != null) ? Number(process.env.REACT_APP_SETTING_DEBOUNCE_MILLIS) : undefined
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
