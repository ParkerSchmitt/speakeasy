import { type SignUpRequest } from '../controllers/viewmodels/SignUpRequest'
import { type SignInRequest } from '../controllers/viewmodels/SignInRequest'
import type AccountRepository from '../repositories/AccountRepository'
import { createHash, randomBytes } from 'crypto'
import { logger } from '../Logger'
import { SignupTemplate } from '../utils/mailer/templates/SignupTemplate'
import { type Mailer } from '../utils/mailer/Mailer'
export const AccountExistsError: Error = new Error('Account already exists')
export const InvalidCredentialsError: Error = new Error('Invalid email or password')
export const InvalidTokenError: Error = new Error('Invalid token')

export interface AccountMediatorConfig {
  Repository: AccountRepository
  Mailer: Mailer
}

class AccountMediator {
  repository: AccountRepository
  mailer: Mailer

  /**
    * Creates the AccountMediator
    * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
    */
  constructor (config: AccountMediatorConfig) {
    this.repository = config.Repository
    this.mailer = config.Mailer
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

        const verifyToken = randomBytes(128).toString('utf8')
        await this.mailer.sendTemplatedEmail(new SignupTemplate(request, verifyToken), request.email)
        await this.repository.insertAccount(request.email, request.firstName, request.lastName, passwordHash, passwordSalt, verifyToken, false)
      }
    } catch (error) {
      const message = 'Unknown Error'
      if (error instanceof Error) {
        logger.error(`AccountMediator.PostReceiveSignup error ${error.toString()}`)
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
        logger.error(`AccountMediator.PostReceiveSignin error ${error.toString()}`)
        throw error
      } else {
        throw new Error(message)
      }
    }
  }

  /**
    * GetVerifyEmail attempts to authenticate the user's email from a given token from a signup email
    * @param token - the token from the signup request,
    * @returns void - updates the email to be verified.
    */
  async GetVerifyEmail (token: string): Promise<void> {
    try {
      const accountId = await this.repository.retrieveAccountIdFromToken(token)
      if (accountId === null) {
        throw InvalidTokenError
      }
      await this.repository.setEmailVerified(accountId, true)
    } catch (error) {
      const message = 'Unknown Error'
      if (error instanceof Error) {
        logger.error(`AccountMediator.GetVerifyEmail error ${error.toString()}`)
        throw error
      } else {
        throw new Error(message)
      }
    }
  }
}

export default AccountMediator
