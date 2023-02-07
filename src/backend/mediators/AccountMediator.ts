import { type SignUpRequest } from '../controllers/viewmodels/SignUpRequest'
import { type SignInRequest } from '../controllers/viewmodels/SignInRequest'
import type AccountRepository from '../repositories/AccountRepository'
import { createHash, randomBytes } from 'crypto'
export const AccountExistsError: Error = new Error('Account already exists')
export const InvalidCredentialsError: Error = new Error('Invalid email or password')

export interface AccountMediatorConfig {
  Repository: AccountRepository
}

class AccountMediator {
  repository: AccountRepository

  /**
    * Creates the AccountMediator
    * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
    */
  constructor (config: AccountMediatorConfig) {
    this.repository = config.Repository
  }

  /**
    * PostReceiveSignup registers an account inside the database
    * @param request the viewmodel of the POST request. Includes email, first name, last name, and password.
    */
  async PostReceiveSignup (request: SignUpRequest): Promise<void> {
    try {
      const exists = await this.repository.emailExists(request.email)
      if (exists) {
        throw AccountExistsError
      } else {
        // Generate hash and salt for password for security
        const passwordSalt = randomBytes(32).toString('hex')

        const passwordHash: string = createHash('sha256').update(request.password + passwordSalt, 'utf8').digest('hex')
        await this.repository.insertAccount(request.email, request.firstName, request.lastName, passwordHash, passwordSalt)
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
    * PostReceiveSignin attempts to authenticate the user with the repository.
    * @param request the viewmodel of the POST request. Includes email, and password.
    * @returns the userid if successful login
    */
  async PostReceiveSignin (request: SignInRequest): Promise<number> {
    try {
      const retrieveObj = await this.repository.retrieveHashAndSalt(request.email)
      if (retrieveObj === null) {
        throw InvalidCredentialsError
      }
      const hash: string = retrieveObj.hash
      const salt: string = retrieveObj.salt

      const passwordAttemptHash: string = createHash('sha256').update(request.password + salt, 'utf8').digest('hex')
      if (passwordAttemptHash !== hash) {
        throw InvalidCredentialsError
      }
      return retrieveObj.id
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

export default AccountMediator
