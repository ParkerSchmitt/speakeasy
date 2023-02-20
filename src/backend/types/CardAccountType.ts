import { type CardType } from './CardType'

export interface CardAccountType extends CardType {
  topic: string
  repetitions: number
  interval: number
  easiness: number
  datetime: number
}
