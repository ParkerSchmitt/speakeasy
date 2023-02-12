/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
export const MissingCardIdError: Error = new Error('Missing cardId from request')
export const MissingTopicError: Error = new Error('Missing topic from request')
export const MissingQualityError: Error = new Error('Missing quality from request')

export const InvalidCardIdTypeError: Error = new Error('CardId must be a integer')
export const InvalidTopicTypeError: Error = new Error('Topic must be a string')
export const InvalidQualityTypeError: Error = new Error('Quality must be a integer between 0-5')

export interface SaveCardRequest {
  topic: string
  cardId: number
  quality: number
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class SaveCardRequest {
  public static parse (json: object): SaveCardRequest {
  type ObjectKey = keyof typeof json

  const topicKey = 'topic' as ObjectKey
  const cardIdKey = 'cardId' as ObjectKey
  const qualityKey = 'quality' as ObjectKey

  if (!json.hasOwnProperty('topic')) {
    throw MissingTopicError
  }
  if (typeof json[topicKey] !== 'string') {
    throw InvalidTopicTypeError
  }

  if (!json.hasOwnProperty('cardId')) {
    throw MissingCardIdError
  }
  // Must be an integer
  if (typeof json[cardIdKey] !== 'number' || !Number.isInteger(json[cardIdKey])) {
    throw InvalidCardIdTypeError
  }

  if (!json.hasOwnProperty('quality')) {
    throw MissingQualityError
  }
  // Must be an integer
  if (typeof json[qualityKey] !== 'number' || !Number.isInteger(json[qualityKey]) || json[qualityKey] > 5 || json[qualityKey] < 0) {
    throw InvalidQualityTypeError
  }

  return json as SaveCardRequest
  }
}
