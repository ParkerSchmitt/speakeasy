import { type ReceiveCardsRequest } from '../controllers/viewmodels/ReceiveCardsRequest'
import type TopicRepository from '../repositories/TopicRepository'
export const InvalidCardAmount: Error = new Error('Requested invalid amount of cards')

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
    * GetReceiveCards receives the cards from the database
    * @param request - the request the user made.
    * @returns a Promise with the information in JSON
    */
  async GetReceiveCards (request: ReceiveCardsRequest): Promise<Array<{ id: number, name: string, description: string, imageUrl: string, scheduledCard: boolean }>> {
    try {
      if (request.amount > this.maxCards || request.amount < 0) {
        throw InvalidCardAmount
      }

      // First lets grab cards that the user is scheduled to learning- stored in the linkages table

      const scheduledCardsResponse = await this.repository.receiveScheduledCards(request.topic, this.maxCards, new Date())

      const leftover: number = request.amount - scheduledCardsResponse.length

      if (leftover > 0) {
        const newCardsResponse = await this.repository.receiveNewCards(request.topic, leftover)
      }

      return scheduledCardsResponse.concat(newCardsResponse)
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
