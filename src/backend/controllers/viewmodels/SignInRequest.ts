/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
import * as EmailValidator from 'email-validator'

export const InvalidEmailError: Error = new Error('Email is not valid')

export const MissingEmailError: Error = new Error('Missing email from request')
export const MissingPasswordError: Error = new Error('Password is not valid')

export const InvalidEmailTypeError: Error = new Error('Email must be a string')
export const InvalidPasswordTypeError: Error = new Error('Password must be a string')

export interface SignInRequest {
  email: string
  password: string
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class Convert {
  public static toSignInRequest (json: object): SignInRequest {
  type ObjectKey = keyof typeof json

  const emailKey = 'email' as ObjectKey
  const passwordKey = 'password' as ObjectKey

  if (!json.hasOwnProperty('email')) {
    throw MissingEmailError
  }
  if (typeof json[emailKey] !== 'string') {
    throw InvalidEmailTypeError
  }
  if (!EmailValidator.validate(json[emailKey])) {
    throw InvalidEmailError
  }

  if (!json.hasOwnProperty('password')) {
    throw MissingPasswordError
  }
  if (typeof json[passwordKey] !== 'string') {
    throw InvalidPasswordTypeError
  }

  return json as SignInRequest
  }
}
