import * as sendgrid from '@sendgrid/mail'
import { type Template } from './templates/TemplateInterface'
import { logger } from '../../Logger'

export interface MailerConfig {
  SENDGRID_API_KEY: string
}

export class Mailer {
  constructor (config: MailerConfig) {
    sendgrid.setApiKey(config.SENDGRID_API_KEY)
  }

  async sendTemplatedEmail (template: Template, toEmailAddress: string): Promise<void> {
    sendgrid.send({
      to: toEmailAddress,
      from: template.fromEmailAddress,
      subject: template.title,
      text: template.displayMessage,
      templateId: template.id,
      dynamicTemplateData: template.injectedValues
    }).catch((error) => {
      logger.info('Mailer.sendTemplatedEmail', error)
    })
  }
}
