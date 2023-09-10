import { type Template } from '../utils/mailer/templates/TemplateInterface'
import { type MailerConfig } from '../utils/mailer/Mailer'

export class MailerMock {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (_config: MailerConfig) {
  }

  async sendTemplatedEmail (template: Template, toEmailAddress: string): Promise<void> {}
}
