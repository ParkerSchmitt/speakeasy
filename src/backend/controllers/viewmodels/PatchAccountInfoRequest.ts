/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
export const MissingKeyError: Error = new Error('Must have at least one key to patch')
export const MissingNewPasswordError: Error = new Error('newPassword must be present for password patch')
export const MissingNewPasswordRepeatError: Error = new Error('newPasswordRepeat must be present for password patch')
export const MissingCurrentPasswordError: Error = new Error('currentPassword must be present for password patch')

export const InvalidNewPasswordError: Error = new Error('newPassword must match newPasswordRepeat')

export const InvalidFirstNameTypeError: Error = new Error('firstName  must be a string')
export const InvalidLastNameTypeError: Error = new Error('lastName  must be a string')
export const InvalidWordsPerDayTypeError: Error = new Error('wordsPerDay must be a integer 1-10')
export const InvalidShowAddedTimeInButtonTypeError: Error = new Error('wordsPerDay must be a boolean')
export const InvalidSendEmailLessonAbsesnceTypeError: Error = new Error('sendEmailLessonAbsesnce must be a boolean')
export const InvalidCurrentPasswordTypeError: Error = new Error('currentPassword must be a string')
export const InvalidNewPasswordTypeError: Error = new Error('newPassword must be a string')
export const InvalidNewPasswordRepeatTypeError: Error = new Error('newPasswordRepeat must be a string')

export interface PatchAccountInfoRequest {
  firstName?: string
  lastName?: string
  wordsPerDay?: number
  showAddedTimeInButton?: boolean
  sendEmailLessonAbsesnce?: boolean
  currentPassword?: string
  newPassword?: string
  newPasswordRepeat?: string
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class PatchAccountInfoRequest {
  public static parse (json: object): PatchAccountInfoRequest {
    type ObjectKey = keyof typeof json

    const firstName = 'firstName' as ObjectKey
    const lastName = 'lastName' as ObjectKey
    const wordsPerDay = 'wordsPerDay' as ObjectKey
    const showAddedTimeInButton = 'showAddedTimeInButton' as ObjectKey
    const sendEmailLessonAbsesnce = 'sendEmailLessonAbsesnce' as ObjectKey
    const currentPassword = 'currentPassword' as ObjectKey
    const newPassword = 'newPassword' as ObjectKey
    const newPasswordRepeat = 'newPasswordRepeat' as ObjectKey

    if (Object.keys(json).length === 0) {
      throw MissingKeyError
    }

    if (firstName in json && typeof json[firstName] !== 'string') {
      throw InvalidFirstNameTypeError
    }
    if (lastName in json && typeof json[lastName] !== 'string') {
      throw InvalidLastNameTypeError
    }
    // Must be an integer
    if (wordsPerDay in json && (typeof json[wordsPerDay] !== 'number' || !Number.isInteger(json[wordsPerDay]) || json[wordsPerDay] > 10 || json[wordsPerDay] < 1)) {
      throw InvalidWordsPerDayTypeError
    }
    if (showAddedTimeInButton in json && typeof json[showAddedTimeInButton] !== 'boolean') {
      throw InvalidShowAddedTimeInButtonTypeError
    }
    if (sendEmailLessonAbsesnce in json && typeof json[sendEmailLessonAbsesnce] !== 'boolean') {
      throw InvalidSendEmailLessonAbsesnceTypeError
    }

    if (currentPassword in json && typeof json[currentPassword] !== 'string') {
      throw InvalidCurrentPasswordTypeError
    }
    if (newPassword in json && typeof json[newPassword] !== 'string') {
      throw InvalidNewPasswordTypeError
    }
    if (newPasswordRepeat in json && typeof json[newPasswordRepeat] !== 'string') {
      throw InvalidNewPasswordRepeatTypeError
    }

    if (newPassword in json || newPasswordRepeat in json || currentPassword in json) {
      if (!json.hasOwnProperty('newPassword')) {
        throw MissingNewPasswordError
      }
      if (!json.hasOwnProperty('newPasswordRepeat')) {
        throw MissingNewPasswordError
      }
      if (!json.hasOwnProperty('currentPassword')) {
        throw MissingCurrentPasswordError
      }
      if (json[newPasswordRepeat] !== json[newPassword]) {
        throw InvalidNewPasswordError
      }
    }
    return json as PatchAccountInfoRequest
  }
}
