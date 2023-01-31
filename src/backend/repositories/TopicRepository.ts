import type { Database } from 'sqlite3'

export interface TopicRepositoryConfig {
  topicTableName: string
  database: Database
}

class TopicRepository {
  topicTableName: string
  database: Database

  /**
     * Creates the SignUpRepository
     * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
     */
  constructor (config: TopicRepositoryConfig) {
    this.topicTableName = config.topicTableName
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
}

export default TopicRepository
