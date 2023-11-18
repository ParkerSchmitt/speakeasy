/* eslint-disable @typescript-eslint/indent */
import { type Request, type Response, type NextFunction } from 'express'
import type SignUpMediator from '../mediators/AccountMediator'
import { AccountExistsError, InvalidCredentialsAuthError, InvalidCredentialsError, InvalidTokenError } from '../mediators/AccountMediator'
import { SignUpRequest } from './viewmodels/SignUpRequest'
import { SignInRequest } from './viewmodels/SignInRequest'
import { logger } from '../Logger'
import { PatchAccountInfoRequest } from './viewmodels/PatchAccountInfoRequest'

export interface AccountControllerConfig {
  Mediator: SignUpMediator
}

class AccountController {
  mediator: SignUpMediator
  /**
     * Creates the AccountController
     * @param config the AccountConfig- the mediator is injected into the controller as a dependency.
     */
  constructor (config: AccountControllerConfig) {
    this.mediator = config.Mediator
  }

  /**
     * PostReceiveSignup converts the JSON request to a viewmodel and attempts to upload it to the DB via the mediator.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
  PostReceiveSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body == null) {
      res.status(400).json({ code: 400, response: 'No body found' })
      return
    }
    try {
      const requestObj = SignUpRequest.parse(req.body)
      const account = await this.mediator.PostReceiveSignup(requestObj)
      const session = req.session
      session.account = account
    } catch (error) {
      const message = 'Could not process request'
      if (error instanceof Error) {
        // We want to keep this the same as a succesful response to prevent users from knowing emails associated with this application
        // However, want to throw an error still for unit testing
        if (error === AccountExistsError) {
          res.status(200).json({ code: 200, response: 'Signed up' })
          return
        }
        logger.error(`AccountController.PostReceiveSignup error ${error.toString()}`)
        res.status(400).json({ code: 400, error: error.message })
        return
      }

      res.status(500).json({ code: 500, error: message })
      return
    }
    res.status(200).json({ code: 200, response: 'Signed up' })
  }

  /**
     * PostReceiveSignin converts the JSON request to a viewmodel and attempts to authenticate the user given the credentials POSTed
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
  PostReceiveSignin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body == null) {
      res.status(400).json({ code: 400, response: 'No body found' })
      return
    }
    let requestObj: SignInRequest
    try {
      requestObj = SignInRequest.parse(req.body)
      const account = await this.mediator.PostReceiveSignin(requestObj)
      // No errors were thrown. user successfully authenticated.
      const session = req.session
      session.account = account
    } catch (error) {
      const message = 'Could not process request'
      if (error instanceof Error) {
        if (error === InvalidCredentialsAuthError) {
          res.status(401).json({ code: 401, response: 'Invalid username or password' })
          return
        }
        logger.error(`AccountController.PostReceiveSignin error ${error.toString()}`)
        res.status(400).json({ code: 400, error: error.message })
        return
      }
      res.status(500).json({ code: 500, error: message })
      return
    }

    res.status(200).json({ code: 200, response: 'Signed in' })
  }

    /**
     * PostSignout attempts to sign a user out.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
    PostSignout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const session = req.session
        session.destroy((error) => {
          throw error
        })
      } catch (error) {
        res.status(200).json({ code: 400, response: 'No session to sign out.' })
      }
    }

  /**
     * GetIsAuthenticated sees if there exist a email under the users session, indicating they are logged in.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
  GetIsAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = req.session
    if ((session.account?.isEmailAuthenticated) !== null && (session.account?.isEmailAuthenticated) === true) {
      res.status(200).json({ code: 200, response: true })
    } else {
      res.status(200).json({ code: 200, response: false })
    }
  }

  /**
     * GetVerifyEmail sees if there exist a email corresponding to the verification token sent. If there is update the database.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
  GetVerifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.params.verificationToken.length > 0 && req.params.verificationToken !== null) {
        await this.mediator.GetVerifyEmail(req.params.verificationToken)

        // If they have a current session (which they should if they verified right after signup, make access easy)
        if (req.session.account?.isEmailAuthenticated !== undefined) {
          req.session.account.isEmailAuthenticated = true
        }

        res.status(200).json({ code: 200, response: true })
      } else {
        res.status(400).json({ code: 400, response: false })
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error === InvalidTokenError) {
          res.status(401).json({ code: 401, response: 'Invalid authentication token' })
        } else {
          logger.error(`AccountController.GetVerifyEmail error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }

  /**
   * GetResendVerifyEmail attempts to resend an email to a user's email
   * @param req the Express request
   * @param res the Express response
   * @param next the next middleware
   * @returns a void promise
   */
  GetResendVerifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = req.session
      if (session.account !== undefined) {
        await this.mediator.GetResendVerifyEmail(session.account)
        res.status(200).json({ code: 200, response: 'Verification has been resent' })
      } else {
        res.status(401).json({ code: 401, response: 'No active session to resend verifcation for' })
      }
    } catch (error) {
      if (error instanceof Error) {
          logger.error(`AccountController.GetResendVerifyEmail error ${error.toString()}`)
          res.status(500).json({ code: 500, error: error.message })
      }
    }
  }


  /**
     * Get returns the JSON account info (name, preferences) for a signed in user
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
  GetAccountInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = req.session
        let accountInfo = await this.mediator.GetAccountInfo(session)
        res.status(200).json({ code: 200, response: accountInfo })
    } catch (error) {
      if (error instanceof Error) {
        if (error === InvalidCredentialsError) {
          logger.warn(`AccountController.GetAccountInfo invalid-login ${error.toString()}`)
          res.status(401).json({ code: 500, response: 'Must be authorized.' })
        }
        logger.error(`AccountController.GetAccountInfo error ${error.toString()}`)
        res.status(500).json({ code: 500, error: error.message })
    }
    }
  }

    /**
     * Patches the account info
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise
     */
    PatchAccountInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (req.body == null) {
        res.status(400).json({ code: 400, response: 'No body found' })
        return
      }
      let requestObj: PatchAccountInfoRequest
      try {
        const session = req.session
        requestObj = PatchAccountInfoRequest.parse(req.body)
        const account = await this.mediator.PatchAccountInfo(session, requestObj)
        res.status(200).json({ code: 200, response: 'Updated account settings' })
      } catch (error) {
        const message = 'Could not process request'
        if (error instanceof Error) {
          if (error === InvalidCredentialsError) {
            logger.warn(`AccountController.PatchAccountInfo invalid-login ${error.toString()}`)
            res.status(401).json({ code: 500, response: 'Must be authorized.' })
          }
          logger.error(`AccountController.PatchAccountInfo error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
          return
        }
        res.status(500).json({ code: 500, error: message })
        return
      }
    }
}

export default AccountController
