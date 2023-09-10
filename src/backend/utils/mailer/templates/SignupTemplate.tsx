import { type Template } from './TemplateInterface'

export interface SignupTemplateConfig {
  firstName: string
  lastName: string
  verifyToken: string
}

export class SignupTemplate implements Template {
  fromEmailAddress: string = 'no-reply@speakeasy.cards'
  title: string = 'Signup Template'
  id: string = 'd-a860a1d4c0b740e693b31e17ac6aff98'
  displayMessage: string = 'Thank you for joining! Please verify your account below'
  injectedValues: Record<string, any> | undefined = undefined

  constructor (request: SignupTemplateConfig) {
    this.injectedValues = {
      first_name: request.firstName,
      last_name: request.lastName,
      button_href: `https://speakeasy.cards/account/verify/${request.verifyToken}`
    }
  }
}
