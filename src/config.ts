import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();


// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface Config {
  NODE_ENV: string;
  PORT: number;
  CORS_ENABLED: boolean
  SESSION_SECRET: string

}
// Loading process.env as ENV interface
const getConfig = (): Partial<Config> => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    CORS_ENABLED: process.env.CORS_ENABLED ? Boolean(process.env.CORS_ENABLED) : undefined,
    SESSION_SECRET: process.env.SESSION_SECRET ? String(process.env.SESSION_SECRET) : undefined,
    };
};
// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
const getSanitzedConfig = (env: Partial<Config>): Config => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config file`);
    }
  }
  return env as Config;
};

const envConfig = getConfig();
const config = getSanitzedConfig(envConfig);

export default config;