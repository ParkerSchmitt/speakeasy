import { type Request, type Response, type NextFunction } from 'express'
import type SignUpMediator from '../mediators/AccountMediator'
import { AccountExistsError } from '../mediators/AccountMediator'
import { Convert } from './viewmodels/SignUpRequest'

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
      const requestObj = Convert.toSignUpRequest(req.body)
      await this.mediator.PostReceiveSignup(requestObj)
    } catch (error) {
      const message = 'Could not process request'
      if (error instanceof Error) {
        // We want to keep this the same as a succesful response to prevent users from knowing emails associated with this application
        // However, want to throw an error still for unit testing
        if (error === AccountExistsError) {
          res.status(200).json({ code: 200, response: 'Signed up' })
          return
        }

        res.status(400).json({ code: 400, error: error.message })
        return
      }

      res.status(500).json({ code: 500, error: message })
      return
    }

    res.status(200).json({ code: 200, response: 'Signed up' })
  }
}

export default AccountController
