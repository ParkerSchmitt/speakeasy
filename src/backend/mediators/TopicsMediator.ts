import type TopicRepository from '../repositories/TopicRepository'
export const AccountExistsError: Error = new Error('Account already exists')
export const InvalidCredentialsError: Error = new Error('Invalid email or password')

export interface TopicMediatorConfig {
  Repository: TopicRepository
}

class TopicMediator {
  repository: TopicRepository

  /**
    * Creates the AccountMediator
    * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
    */
  constructor (config: TopicMediatorConfig) {
    this.repository = config.Repository
  }

  /**
    * PostReceiveSignup registers an account inside the database
    * @param request the viewmodel of the POST request. Includes email, first name, last name, and password.
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
}

export default TopicMediator
