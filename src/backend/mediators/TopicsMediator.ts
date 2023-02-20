import { type Session, type SessionData } from 'express-session'
import { type ReceiveCardsRequest } from '../controllers/viewmodels/ReceiveCardsRequest'
import { type SaveCardRequest } from '../controllers/viewmodels/SaveCardRequest'
import type TopicRepository from '../repositories/TopicRepository'
import { type CardAccountType } from '../types/CardAccountType'
export const InvalidCardAmount: Error = new Error('Requested invalid amount of cards')
export const InvalidCredentialsError: Error = new Error('Not authorized')

export interface TopicMediatorConfig {
  Repository: TopicRepository
  MaxCards: number
}

class TopicMediator {
  repository: TopicRepository
  maxCards: number

  /**
    * Creates the AccountMediator
    * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
    */
  constructor (config: TopicMediatorConfig) {
    this.repository = config.Repository
    this.maxCards = config.MaxCards
  }

  /**
    * GetReceiveTopics receives the topics from the database
    * @returns a Promise with the information in JSON
    */
  async GetReceiveTopics (): Promise<Array<{ id: number, name: string, description: string, imageUrl: string }>> {
    try {
      const response = await this.repository.receiveTopics()
      if (response === null) {
        return []
      } else {
        return response
      }
    } catch (error) {
      const message = 'Unknown Error'
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(message)
      }
    }
  }

  /**
    * PostReceiveCards receives the cards from the database
    * @param request - the request the user made.
    * @returns a Promise with the information in JSON
    */
  async PostReceiveCards (session: Session & Partial<SessionData>, request: ReceiveCardsRequest): Promise<Array<{ id: number, previewText: string, revealText: string, scheduledCard: boolean }>> {
    try {
      if (request.amount > this.maxCards || request.amount < 0) {
        throw InvalidCardAmount
      }
      if (session.accountId == null) {
        throw InvalidCredentialsError
      }

      // First see if there are any review cards. If there are, grab them instead
      if (session.activeReviews !== undefined && session.activeReviews[request.topic].length !== 0) {
        return session.activeReviews[request.topic].splice(0, request.amount).map(cardData => ({ id: cardData.id, previewText: cardData.previewText, revealText: cardData.revealText, pronunciation: cardData.pronunciation, imageUrl: cardData.imageUrl, audioUrl: cardData.audioUrl, scheduledCard: true }))
      }

      // First lets grab cards that the user is scheduled to learn- stored in the linkages table

      const scheduledCardsResponse = await this.repository.receiveStoredCards(request.topic, session.accountId, request.amount, Math.floor(new Date().getTime() / 1000.0))
      const scheduledCards = scheduledCardsResponse.map(cardData => ({ ...cardData, scheduledCard: true }))

      const leftover: number = request.amount - scheduledCardsResponse.length
      const offset: number = await this.repository.receiveMaxCardReached(request.topic, session.accountId) ?? 0

      if (leftover > 0) {
        const newCardsResponse = await this.repository.receiveNewCards(request.topic, leftover, offset)
        const newCards = newCardsResponse.map(cardData => ({ ...cardData, scheduledCard: false }))
        return scheduledCards.concat(newCards)
      }
      return scheduledCards
    } catch (error) {
      const message = 'Unknown Error'
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(message)
      }
    }
  }

  saveCardToReviewStack (session: Session & Partial<SessionData>, topic: string, card: CardAccountType): void {
    if (session.activeReviews === undefined) {
      session.activeReviews = {}
    }
    if (session.activeReviews[topic] === undefined) {
      session.activeReviews[topic] = [card]
    } else {
      session.activeReviews[topic].push(card)
    }
  }

  /**
    * PostSaveCard stores the learned card information in the database
    * @param request - the request the user made.
    * @returns a void Promise
    */
  async PostSaveCard (session: Session & Partial<SessionData>, request: SaveCardRequest): Promise<void> {
    try {
      if (session.accountId == null) {
        throw InvalidCredentialsError
      }

      // First see if a card already exists
      const card = await this.repository.receiveStoredCard(session.accountId, request.cardId)

      /**
       * This inline method calculates SM2 information about a card in order to space it correctly for a user to learn effectively.
       * Information about this algorithm can be found below:
       * https://super-memory.com/english/ol/sm2.htm
       * @param quality- the score the user gave for the card on how easy it was to recall.
       * @param easiness - Calculated score of how easy it is for the user to remember
       * @param interval - How far to space the card. Reset if user can't remember.
       * @param repetitions - How many successful repetitions the user has had. Reset if can't remember
       * @param date - EPOCH date
       * @returns Object contained new quality, date, interval calculated.
       */
      const calculateSM2Variables = (quality: number, easiness: number, interval: number, repetitions: number, date: number): { easiness: number, interval: number, repetitions: number, date: number } => {
        if (quality < 2) {
          interval = 1
          repetitions = 0
        } else {
          if (repetitions === 0) {
            interval = 1
          } else if (repetitions === 1) {
            interval = 5
          } else {
            interval = Math.ceil(interval * easiness)
          }
          repetitions = repetitions + 1
        }
        easiness += 0.1 - (4 - quality) * (0.08 + (4 - quality) * 0.02)
        if (easiness < 1.3) {
          easiness = 1.3
        }
        date += (86400000 * interval)
        return { easiness, interval, repetitions, date }
      }

      // The card already exists. Let's calculate new property values for it and update the record
      if (card !== null) {
        const { easiness, interval, repetitions, date } = calculateSM2Variables(request.quality, card.easiness, card.interval, card.repetitions, Date.now())
        await this.repository.updateLearnedCard(request.cardId, session.accountId, easiness, interval, repetitions, date)
        // Per the SM2 algorithm, we also want the user to review the card until they recognize it.
        if (request.quality < 2) {
          this.saveCardToReviewStack(session, request.topic, card)
        }

      // The card doesn't exist. Lets insert a new card in memory with inital properties
      } else {
        const { easiness, interval, repetitions, date } = calculateSM2Variables(request.quality, 2.5, 0, 0, Date.now())
        await this.repository.insertLearnedCard(request.cardId, session.accountId, easiness, interval, repetitions, date)
        // Now it exists
        const card = await this.repository.receiveStoredCard(session.accountId, request.cardId)

        if (request.quality < 2 && card !== null) {
          this.saveCardToReviewStack(session, request.topic, card)
        }
      }
    } catch (error) {
      const message = 'Unknown Error'
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(message)
      }
    }
  }
}

export default TopicMediator
