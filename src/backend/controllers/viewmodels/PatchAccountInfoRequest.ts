/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
export const MissingKeyError: Error = new Error('Must have at least one key to patch')

export const InvalidFirstNameTypeError: Error = new Error('firstName  must be a string')
export const InvalidLastNameTypeError: Error = new Error('lastName  must be a string')
export const InvalidWordsPerDayTypeError: Error = new Error('wordsPerDay must be a integer')
export const InvalidShowAddedTimeInButtonTypeError: Error = new Error('wordsPerDay must be a boolean')
export const InvalidSendEmailLessonAbsesnceTypeError: Error = new Error('sendEmailLessonAbsesnce must be a boolean')


export interface PatchAccountInfoRequest {
  firstName?: string
  lastName?: string
  wordsPerDay?: number
  showAddedTimeInButton?: boolean
  sendEmailLessonAbsesnce?: boolean
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
  const sendEmailLessonAbsesnce = 'showAddedTimeInButton' as ObjectKey

  if (!json) {
    throw MissingKeyError
  }

  if (typeof json[firstName] !== 'string') {
    throw InvalidFirstNameTypeError
  }
  if (typeof json[lastName] !== 'string') {
    throw InvalidLastNameTypeError
  }
  // Must be an integer
  if (typeof json[wordsPerDay] !== 'number' || !Number.isInteger(json[wordsPerDay])) {
    throw InvalidWordsPerDayTypeError
  }
  if (typeof json[showAddedTimeInButton] !== 'boolean') {
    throw InvalidShowAddedTimeInButtonTypeError
  }
  if (typeof json[sendEmailLessonAbsesnce] !== 'boolean') {
    throw InvalidSendEmailLessonAbsesnceTypeError
  }

  return json as PatchAccountInfoRequest
  }
}
