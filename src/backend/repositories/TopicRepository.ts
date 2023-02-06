import type { Database } from 'sqlite3'

export interface TopicRepositoryConfig {
  topicTableName: string
  cardTableName: string
  database: Database
}

class TopicRepository {
  topicTableName: string
  cardTableName: string
  database: Database

  /**
     * Creates the SignUpRepository
     * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
     */
  constructor (config: TopicRepositoryConfig) {
    this.topicTableName = config.topicTableName
    this.cardTableName = config.cardTableName
    this.database = config.database
  }

  /**
     * emailExists checks to see if a account exists inside of the database
     * @param email the email to check for
     * @returns a boolean promise. TRUE if there is an email found, FALSE if there isn't.
     */
  async receiveTopics (): Promise<Array<{ id: number, name: string, description: string, imageUrl: string }>> {
    const query = `SELECT id, name, description, imageUrl FROM ${this.topicTableName}`
    const topics = await new Promise<any[]>((resolve, reject) => {
      this.database.all(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return topics
  }

  /**
     * receiveNewCards attempts to retrieve cards from a given topic
     * @param topic the name of the topic to search for cards under
     * @param amount the amount of cards to try and receive
     * @param offset the amount of cards to offset by
     * @returns a promise for an array containing the cards
     */
  async receiveNewCards (topic: string, amount: number, offset: number): Promise<Array<{ id: number, targetLanguageWord: string, nativeLanguageWord: string }>> {
    const query = `SELECT ${this.cardTableName}.id, targetLanguageWord, nativeLanguageWord FROM ${this.cardTableName} INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id WHERE ${this.topicTableName}.name = "${topic}" ORDER BY ${this.cardTableName}.id ASC LIMIT ${amount} OFFSET ${offset}`
    const topics = await new Promise<any[]>((resolve, reject) => {
      this.database.all(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return topics
  }
}

export default TopicRepository
