import type { Database } from 'sqlite3'
import { type CardAccountType } from '../types/CardAccountType'
import { type CardType } from '../types/CardType'

export interface TopicRepositoryConfig {
  topicTableName: string
  cardTableName: string
  cardAccountLinkageTableName: string
  cardReportTableName: string

  database: Database
}

class TopicRepository {
  topicTableName: string
  cardTableName: string
  cardAccountLinkageTableName: string
  cardReportTableName: string
  database: Database

  /**
     * Creates the SignUpRepository
     * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
     */
  constructor (config: TopicRepositoryConfig) {
    this.topicTableName = config.topicTableName
    this.cardTableName = config.cardTableName
    this.cardAccountLinkageTableName = config.cardAccountLinkageTableName
    this.cardReportTableName = config.cardReportTableName
    this.database = config.database
  }

  /**
     * receives the topics in the system
     * @returns a promise with the resulting topic information
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
     * receiveTopicPercentage gets the percentage of how much a user has learned from a topic
     * @param userId the id of the user
     * @param topicId the id of the topic
     * @returns a promise holding the percentage as a decimal i.e (0.993531) for 99.3531%
     */
  async receiveTopicPercentage (userId: number, topic: string): Promise<{ percentageLearned: number } | null> {
    // Have to do * .1 otherwise it will try to do integer divinsion instead of giving us a float
    const query = `SELECT (COUNT(cardAccountLinkageTable.id) * 1.0 / COUNT(cardsTable.id)) AS percentageLearned FROM ${this.topicTableName} topicTable INNER JOIN ${this.cardTableName} cardsTable ON topicTable.id = cardsTable.topicId LEFT JOIN ${this.cardAccountLinkageTableName} cardAccountLinkageTable on cardsTable.id = cardAccountLinkageTable.card_id  AND cardAccountLinkageTable.account_id = ${userId} WHERE topicTable.name = '${topic}' GROUP BY topicTable.id`
    const rows = await new Promise<any>((resolve, reject) => {
      this.database.all(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    if (rows.length === 0) {
      return null
    } else {
      const percentageLearned = rows[0].percentageLearned
      return { percentageLearned }
    }
  }

  /**
     * receiveTopicPractice gets the items a user has to practice of a  topic
     * @param accountId the id of the user
     * @param topic the name of the topic
     * @returns a promise for an array containing the cards
     */
  async receiveTopicPractice (accountId: number, topic: string, amount: number): Promise<CardAccountType[] & CardType[]> {
    // Have to do * .1 otherwise it will try to do integer divinsion instead of giving us a float
    const query = `SELECT ${this.cardTableName}.id, ${this.cardTableName}.topicId as topicId, ${this.topicTableName}.name AS topic, ${this.cardTableName}.previewText AS previewText, ${this.cardTableName}.revealText AS revealText, ${this.cardTableName}.audioUrl AS audioUrl, ${this.cardTableName}.imageUrl AS imageUrl, ${this.cardTableName}.pronunciation AS pronunciation,  ${this.cardAccountLinkageTableName}.interval, ${this.cardAccountLinkageTableName}.repetitions, ${this.cardAccountLinkageTableName}.easiness, ${this.cardAccountLinkageTableName}.datetime FROM ${this.cardTableName} 
    INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id 
    INNER JOIN ${this.cardAccountLinkageTableName} ON ${this.cardTableName}.id = ${this.cardAccountLinkageTableName}.card_id
    WHERE ${this.cardAccountLinkageTableName}.account_id = ${accountId}
    ORDER BY ${this.cardAccountLinkageTableName}.repetitions ASC, ${this.cardAccountLinkageTableName}.easiness ASC
    LIMIT ${amount}`
    const topics = await new Promise<any>((resolve, reject) => {
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
  async receiveNewCards (topic: string, amount: number, offset: number): Promise<CardType[]> {
    const query = `SELECT ${this.cardTableName}.id, topicId, previewText, revealText, pronunciation, audioUrl, ${this.cardTableName}.imageUrl AS imageUrl FROM ${this.cardTableName} INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id WHERE ${this.topicTableName}.name = "${topic}" ORDER BY ${this.cardTableName}.id ASC LIMIT ${amount} OFFSET ${offset}`
    const cards = await new Promise<any[]>((resolve, reject) => {
      this.database.all(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return cards
  }

  /**
     * receiveStoredCard attempts to retrieve a particular card from a given topic already learned by a user
     * @param accountId the id of the user associated with the card stored
     * @param cardId the id of the card
     * @returns a promise for the card, or null if it doesn't exist yet.
     */
  async receiveStoredCard (accountId: number, cardId: number): Promise< CardAccountType | null> {
    const query = `SELECT ${this.cardTableName}.id, ${this.cardTableName}.topicId as topicId, ${this.topicTableName}.name AS topic, ${this.cardTableName}.previewText AS previewText, ${this.cardTableName}.revealText AS revealText, ${this.cardTableName}.audioUrl AS audioUrl, ${this.cardTableName}.imageUrl AS imageUrl, ${this.cardTableName}.pronunciation AS pronunciation,  ${this.cardAccountLinkageTableName}.interval, ${this.cardAccountLinkageTableName}.repetitions, ${this.cardAccountLinkageTableName}.easiness, ${this.cardAccountLinkageTableName}.datetime FROM ${this.cardTableName} 
                      INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id 
                      INNER JOIN ${this.cardAccountLinkageTableName} ON ${this.cardTableName}.id = ${this.cardAccountLinkageTableName}.card_id
                      WHERE ${this.cardAccountLinkageTableName}.card_id = ${cardId} AND ${this.cardAccountLinkageTableName}.account_id = ${accountId} 
                      LIMIT 1`
    const cards = await new Promise<any | null>((resolve, reject) => {
      this.database.get(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          if (result === undefined) {
            resolve(null)
          }
          resolve(result)
        }
      })
    })
    return cards
  }

  /**
     * receiveStoredCards attempts to retrieve cards from a given topic already learned by a user
     * @param topic the name of the topic to search for cards under
     * @param accountId the id of the user associated with the cards stored
     * @param amount the amount of cards to try and receive
     * @param date the time we should look for cards for
     * @returns a promise for an array containing the cards
     */
  async receiveStoredCards (topic: string, accountId: number, amount: number, date: number): Promise<CardType[]> {
    const query = `SELECT ${this.cardTableName}.id, topicId, previewText, revealText, ${this.cardTableName}.imageUrl, audioUrl, pronunciation FROM ${this.cardTableName} 
                    INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id 
                    INNER JOIN ${this.cardAccountLinkageTableName} ON ${this.cardTableName}.id = ${this.cardAccountLinkageTableName}.card_id
                    WHERE ${this.cardAccountLinkageTableName}.datetime < ${date} AND ${this.cardAccountLinkageTableName}.account_id = ${accountId} 
                    ORDER BY ${this.cardAccountLinkageTableName}.datetime ASC 
                    LIMIT ${amount}`
    const cards = await new Promise<any[]>((resolve, reject) => {
      this.database.all(query, (error, result) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return cards
  }

  /**
     * receiveMaxCardReached attempts to retrieve the highest card a user has learned
     * @param topic the name of the topic to search for cards under
     * @param accountId the id of the user associated with the cards stored
     * @returns a promise containing a integer representing the highest card a user has learned, or null
     */
  async receiveMaxCardReached (topic: string, accountId: number): Promise<number> {
    const query = `SELECT MAX(${this.cardTableName}.id) as max FROM ${this.cardTableName} 
                    INNER JOIN ${this.topicTableName} ON ${this.cardTableName}.topicId = ${this.topicTableName}.id 
                    INNER JOIN ${this.cardAccountLinkageTableName} ON ${this.cardTableName}.id = ${this.cardAccountLinkageTableName}.card_id
                    WHERE ${this.cardAccountLinkageTableName}.account_id = ${accountId}`
    const max = await new Promise<any>((resolve, reject) => {
      this.database.get(query, (error: Error, result: { max: number }) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve(result.max)
        }
      })
    })
    return max
  }

  /**
     * saveLearnedCard attempts to save a card to auser
     * @param topic the name of the topic to search for cards under
     * @param cardId the id of the card to insert/update
     * @param accountId the id of the user associated with the cards stored
     * @param easiness the easiness of the word to the user
     * @param interval the interval to store/update
     * @param repetitions the repetitions to store/update
     * @param date the review date to store/update
     * @returns a promise containing a integer representing the highest card a user has learned, or null
     */
  async updateLearnedCard (cardId: number, accountId: number, easiness: number, interval: number, repetitions: number, date: number): Promise<void> {
    const query = `UPDATE ${this.cardAccountLinkageTableName} 
                  SET easiness=$easiness, interval=$interval, repetitions=$repetitions, datetime=$date
                  WHERE ${this.cardAccountLinkageTableName}.card_id = $cardId AND ${this.cardAccountLinkageTableName}.account_id = $accountId`
    await new Promise<void>((resolve, reject) => {
      this.database.get(query, {
        $cardId: cardId,
        $accountId: accountId,
        $easiness: easiness,
        $interval: interval,
        $repetitions: repetitions,
        $date: date
      }, (error: Error) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
     * insertLearnedCard attempts to save a card to auser
     * @param cardId the id of the card to insert/update
     * @param accountId the id of the user associated with the cards stored
     * @param easiness the easiness of the word to the user
     * @param interval the interval to store/update
     * @param repetitions the repetitions to store/update
     * @param date the review date to store/update
     * @returns a promise containing a integer representing the highest card a user has learned, or null
     */
  async insertLearnedCard (cardId: number, accountId: number, easiness: number, interval: number, repetitions: number, date: number): Promise<void> {
    const query = `INSERT INTO ${this.cardAccountLinkageTableName} (card_id, account_id, easiness, interval, repetitions, datetime) VALUES ($cardId,$accountId,$easiness,$interval,$repetitions,$date)`
    await new Promise<void>((resolve, reject) => {
      this.database.get(query, {
        $cardId: cardId,
        $accountId: accountId,
        $easiness: easiness,
        $interval: interval,
        $repetitions: repetitions,
        $date: date
      }, (error: Error) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
     * insertReportCart attempts to save a report about a card
     * @param cardId the id of the card that is being reported
     * @param accountId the id of the user associated with the report
     * @param type area of interest for the report "image", "reveal", "preview", "pronunciation"
     * @param reason why the user is reporting the card "incorrect", "offensive", "improvement"
     * @param comment comment from user
     * @returns a void promise
     */
  async insertReportCart (cardId: number, accountId: number, type: string, reason: string, comment: string): Promise<void> {
    const query = `INSERT INTO ${this.cardReportTableName} (card_id, account_id, type, reason, comment) VALUES ($cardId,$accountId,$type,$reason,$comment)`
    await new Promise<void>((resolve, reject) => {
      this.database.get(query, {
        $cardId: cardId,
        $accountId: accountId,
        $type: type,
        $reason: reason,
        $comment: comment
      }, (error: Error) => {
        if (error !== null) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

export default TopicRepository
