import sgMail from '@sendgrid/mail'
import { type Template } from './templates/TemplateInterface'
import { logger } from '../../Logger'

export interface MailerConfig {
  SENDGRID_API_KEY: string
}

export class Mailer {
  constructor (config: MailerConfig) {
    try {
      sgMail.setApiKey(config.SENDGRID_API_KEY)
    } catch (err) {
      console.log(err)
    }
  }

  async sendTemplatedEmail (template: Template, toEmailAddress: string): Promise<void> {
    sgMail.send({
      to: toEmailAddress,
      from: template.fromEmailAddress,
      subject: template.title,
      text: template.displayMessage,
      templateId: template.id,
      dynamicTemplateData: template.injectedValues,
      html: '&nbsp;'
    }).then(() => {
      console.log('Sent!')
    }).catch((error) => {
      console.log(error)
      logger.info('Mailer.sendTemplatedEmail', error)
    })
  }
}
