import { type Client } from 'pg'
import { logger } from '../Logger'

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
     * retrieveHashAndSalt attempts to find the given hash and salt for a certain email
     * @param email the email to check for
     * @returns a object, OR null if there is nothing for the given email (email doesn't exist). {hash: string, salt: string}
     */
  async retrieveHashAndSalt (email: string): Promise<{ id: number, hash: string, salt: string } | null> {
    const query = `SELECT id, "passwordHash", "passwordSalt" FROM ${this.tableName} WHERE email=$1`
    const values = [email]
    const result = await this.client.query(query, values)
    if (result.rowCount === 0) {
      return null
    } else {
      const id = result.rows[0].id
      const hash = result.rows[0].passwordHash
      const salt = result.rows[0].passwordSalt
      return { id, hash, salt }
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
  async insertAccount (email: string, firstName: string, lastName: string, passwordHash: string, passwordSalt: string): Promise<void> {
    const query = `INSERT INTO ${this.tableName}(email, "firstName", "lastName", "passwordHash", "passwordSalt") VALUES($1, $2, $3, $4, $5)`
    const values = [email, firstName, lastName, passwordHash, passwordSalt]
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
}

export default AccountRepository
