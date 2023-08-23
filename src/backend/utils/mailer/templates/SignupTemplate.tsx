import { type SignUpRequest } from '../../../controllers/viewmodels/SignUpRequest'
import { type Template } from './TemplateInterface'

export class SignupTemplate implements Template {
  fromEmailAddress: string = 'no-reply@speakeasy.cards'
  title: string = 'Signup Template'
  id: string = 'testId'
  displayMessage: string = 'Thank you for joining! Please verify your account below'
  injectedValues: Record<string, any> | undefined = undefined

  constructor (request: SignUpRequest, verifyToken: string) {
    this.injectedValues = {
      request,
      verifyToken
    }
  }
}
