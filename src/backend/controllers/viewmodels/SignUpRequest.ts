/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
import * as EmailValidator from 'email-validator'

export const MissingEmailError: Error = new Error('Missing email from request')
export const InvalidEmailError: Error = new Error('Email is not valid')
export const MissingFirstNameError: Error = new Error('Missing first name from request')
export const MissingLastNameError: Error = new Error('Missing last name from request')
export const MissingPasswordError: Error = new Error('Missing password  from request')

export const InvalidEmailTypeError: Error = new Error('Email must be a string')
export const InvalidFirstNameTypeError: Error = new Error('First name must be a string')
export const InvalidLastNameTypeError: Error = new Error('Last name must be a string')
export const InvalidPasswordTypeError: Error = new Error('Password must be a string')

export interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class SignUpRequest {
  public static parse (json: object): SignUpRequest {
  type ObjectKey = keyof typeof json

  const emailKey = 'email' as ObjectKey
  const firstNameKey = 'firstName' as ObjectKey
  const lastNameKey = 'lastName' as ObjectKey
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

  if (!json.hasOwnProperty('firstName')) {
    throw MissingFirstNameError
  }
  if (typeof json[firstNameKey] !== 'string') {
    throw InvalidFirstNameTypeError
  }

  if (!json.hasOwnProperty('lastName')) {
    throw MissingLastNameError
  }
  if (typeof json[lastNameKey] !== 'string') {
    throw InvalidLastNameTypeError
  }

  if (!json.hasOwnProperty('password')) {
    throw MissingPasswordError
  }
  if (typeof json[passwordKey] !== 'string') {
    throw InvalidPasswordTypeError
  }

  return json as SignUpRequest
  }
}
