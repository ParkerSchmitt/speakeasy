/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
export const MissingAmountError: Error = new Error('Missing amount from request')
export const MissingTopicError: Error = new Error('Missing topic from request')

export const InvalidAmountTypeError: Error = new Error('Amount must be a integer')
export const InvalidTopicTypeError: Error = new Error('Topic must be a string')

export interface ReceiveCardsRequest {
  amount: number
  topic: string
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class ReceiveCardsRequest {
  public static parse (json: object): ReceiveCardsRequest {
  type ObjectKey = keyof typeof json

  const topicKey = 'topic' as ObjectKey
  const amountKey = 'amount' as ObjectKey

  if (!json.hasOwnProperty('topic')) {
    throw MissingTopicError
  }
  if (typeof json[topicKey] !== 'string') {
    throw InvalidTopicTypeError
  }

  if (!json.hasOwnProperty('amount')) {
    throw MissingAmountError
  }
  // Must be an integer
  if (typeof json[amountKey] !== 'number' || !Number.isInteger(json[amountKey])) {
    throw InvalidAmountTypeError
  }

  return json as ReceiveCardsRequest
  }
}
