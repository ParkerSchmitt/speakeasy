import * as winston from 'winston'

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/backend.log'
    })
  ]
})
