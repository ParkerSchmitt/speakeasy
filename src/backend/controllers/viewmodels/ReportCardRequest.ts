/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
export const MissingCardIdError: Error = new Error('Missing cardId from request')
export const MissingTopicError: Error = new Error('Missing topic from request')
export const MissingTypeError: Error = new Error('Missing type from request')
export const MissingReasonError: Error = new Error('Missing reason from request')
export const MissingCommentError: Error = new Error('Missing comment from request')

export const InvalidCardIdTypeError: Error = new Error('CardId must be a integer')
export const InvalidTopicTypeError: Error = new Error('Topic must be a string')
export const InvalidTypeTypeError: Error = new Error('Type  must be a string "image", "preview", "reveal", or "pronunciation"')
export const InvalidReasonTypeError: Error = new Error('Reason must be a string "offensive", "incorrect", "improvement"')
export const InvalidCommentTypeError: Error = new Error('Comment must be a string')

export interface ReportCardRequest {
  topic: string
  cardId: number
  type: string
  reason: string
  comment: string
}

// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
export class ReportCardRequest {
  public static parse (json: object): ReportCardRequest {
  type ObjectKey = keyof typeof json

  const topicKey = 'topic' as ObjectKey
  const cardIdKey = 'cardId' as ObjectKey
  const typeKey = 'type' as ObjectKey
  const reasonKey = 'reason' as ObjectKey
  const commentKey = 'comment' as ObjectKey

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

  if (!json.hasOwnProperty('type')) {
    throw MissingTypeError
  }
  // Type must be a string "image", "preview", "reveal", or "pronunciation"
  if (typeof json[typeKey] !== 'string' || !(json[typeKey] === 'image' || json[typeKey] === 'preview' || json[typeKey] === 'reveal' || json[typeKey] === 'pronunciation')) {
    throw InvalidTypeTypeError
  }

  if (!json.hasOwnProperty('reason')) {
    throw MissingReasonError
  }
  // Type must be a string "image", "preview", "reveal", or "pronunciation"
  if (typeof json[reasonKey] !== 'string' || !(json[reasonKey] === 'offensive' || json[reasonKey] === 'incorrect' || json[reasonKey] === 'improvement')) {
    throw InvalidReasonTypeError
  }

  if (!json.hasOwnProperty('comment')) {
    throw MissingCommentError
  }
  // Type must be a string "image", "preview", "reveal", or "pronunciation"
  if (typeof json[commentKey] !== 'string') {
    throw InvalidCommentTypeError
  }

  return json as ReportCardRequest
  }
}
