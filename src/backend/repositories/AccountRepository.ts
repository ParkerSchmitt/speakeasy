import { type Client } from 'pg'
import { logger } from '../Logger'
import { type AccountType } from '../types/AccountType'

export interface AccountRepositoryConfig {
  tableName: string
  client: Client
}

class AccountRepository {
  tableName: string
  client: Client

  /**
     * Creates the SignUpRepository
     * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
     */
  constructor (config: AccountRepositoryConfig) {
    this.tableName = config.tableName
    this.client = config.client
  }

  /**
     * emailExists checks to see if a account exists inside of the database
     * @param email the email to check for
     * @returns a boolean promise. TRUE if there is an email found, FALSE if there isn't.
     */
  async emailExists (email: string): Promise<boolean> {
    const query = `SELECT id FROM ${this.tableName} WHERE email=$1`
    const values = [email]
    const result = await this.client.query(query, values)
    // there must be a email that exists already in the database.
    if (result.rowCount !== 0) {
      return true
    } else {
      return false
    }
  }

  /**
     * retrieveAccountDTO attempts to find the given account information given an email
     * @param email the email to check for
     * @returns a object, OR null if there is nothing for the given email (email doesn't exist). {hash: string, salt: string}
     */
  async retrieveAccountDTO (email: string): Promise<AccountType | null> {
    const query = `SELECT id, "email", "firstName", "lastName", "passwordHash", "passwordSalt", "emailVerificationToken", "isEmailAuthenticated", "wordsPerDay", "showAddedTimeInButton", "sendEmailLessonAbsesnce" FROM ${this.tableName} WHERE email=$1`
    const values = [email]
    const result = await this.client.query(query, values)
    if (result.rowCount === 0) {
      return null
    } else {
      return { ...result.rows[0] }
    }
  }

  /**
     * insertAccount puts a account into the database.
     * @param email The email to insert
     * @param firstName The first name to insert
     * @param lastName the last name to insert
     * @param passwordHash the hash of the password to insert
     * @param passwordSalt the salt for the password to insert
     */
  async insertAccount (email: string, firstName: string, lastName: string, passwordHash: string, passwordSalt: string, emailVerificationToken: string, isEmailAuthenticated: boolean): Promise<void> {
    const query = `INSERT INTO ${this.tableName}(email, "firstName", "lastName", "passwordHash", "passwordSalt", "emailVerificationToken", "isEmailAuthenticated") VALUES($1, $2, $3, $4, $5, $6, $7)`
    const values = [email, firstName, lastName, passwordHash, passwordSalt, emailVerificationToken, isEmailAuthenticated]
    await new Promise<void>((resolve, reject) => {
      this.client.query(query, values, (err, res) => {
        if (err !== null) {
          logger.error(`AccountRepository.insertAccount error ${err.toString()}`)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
     * retrieveAccountIdFromToken attempts to find an account associated with a token
     * @param token The token to search on
     */
  async retrieveAccountIdFromToken (token: string): Promise<number | null> {
    const query = `SELECT "id" FROM ${this.tableName} WHERE "emailVerificationToken"=$1`
    const values = [token]
    const result = await this.client.query(query, values)
    if (result.rowCount === 0) {
      return null
    } else {
      const id = result.rows[0].id
      return id
    }
  }

  /**
     * setEmailVerified updates an account to have a verified email status and removes the emailVerificationToken
     * @param accountId The account id to update
     * @param verifiedStatus the status to update the verification to
     */
  async setEmailVerified (accountId: number, verifiedStatus: boolean): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                  SET "isEmailAuthenticated"=$1, "emailVerificationToken"=$2
                  WHERE ${this.tableName}.id = $3`
    const values = [verifiedStatus, '', accountId]
    await this.client.query(query, values)
  }

  /**
     * setFirstName updates an account's first name
     * @param accountId The account id to update
     * @param value the value to update the field to
     */
  async setFirstName (accountId: number, value: string): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                  SET "firstName"=$1
                  WHERE ${this.tableName}.id = $2`
    const values = [value, accountId]
    await this.client.query(query, values)
  }

  /**
     * setLastName updates an account's last name
     * @param accountId The account id to update
     * @param value the value to update the field to
     */
  async setLastName (accountId: number, value: string): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                    SET "lastName"=$1
                    WHERE ${this.tableName}.id = $2`
    const values = [value, accountId]
    await this.client.query(query, values)
  }

  /**
     * setWordsPerDay updates an account's wordsPerDay setting
     * @param accountId The account id to update
     * @param value the value to update the field to
     */
  async setWordsPerDay (accountId: number, value: number): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                    SET "wordsPerDay"=$1
                    WHERE ${this.tableName}.id = $2`
    const values = [value, accountId]
    await this.client.query(query, values)
  }

  /**
     * setShowAddedTimeInButton updates an account's showAddedTimeInButton setting
     * @param accountId The account id to update
     * @param value the value to update the field to
     */
  async setShowAddedTimeInButton (accountId: number, value: boolean): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                    SET "showAddedTimeInButton"=$1
                    WHERE ${this.tableName}.id = $2`
    const values = [value, accountId]
    await this.client.query(query, values)
  }

  /**
     * setSendEmailLessonAbsesnce updates an account's sendEmailLessonAbsesnce setting
     * @param accountId The account id to update
     * @param value the value to update the field to
     */
  async setSendEmailLessonAbsesnce (accountId: number, value: boolean): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                    SET "sendEmailLessonAbsesnce"=$1
                    WHERE ${this.tableName}.id = $2`
    const values = [value, accountId]
    await this.client.query(query, values)
  }

  /**
     * setSendEmailLessonAbsesnce updates an account's password
     * @param accountId The account id to update
     * @param hash the hash to update
     * @param salt the salt to update
     */
  async setPassword (accountId: number, hash: string, salt: string): Promise<void> {
    const query = `UPDATE ${this.tableName} 
                      SET "passwordHash"=$1, SET "passwordSalt" = $2
                      WHERE ${this.tableName}.id = $3`
    const values = [hash, salt, accountId]
    await this.client.query(query, values)
  }

  /**
     * deleteAccount destroy's an account.
     * @param accountId The account id to destroy
     * @param value the value to update the field to
     */
  async deleteAccount (accountId: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} 
                      WHERE ${this.tableName}.id = $1`
    const values = [accountId]
    await this.client.query(query, values)
  }
}

export default AccountRepository
