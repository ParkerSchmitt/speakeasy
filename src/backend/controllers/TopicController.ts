import { type Request, type Response, type NextFunction } from 'express'
import { InvalidCredentialsError } from '../mediators/AccountMediator'
import type TopicsMediator from '../mediators/TopicMediator'
import { ReceiveCardsRequest } from './viewmodels/ReceiveCardsRequest'
import { ReportCardRequest } from './viewmodels/ReportCardRequest'
import { SaveCardRequest } from './viewmodels/SaveCardRequest'
import { logger } from '../Logger'

export interface TopicControllerConfig {
  Mediator: TopicsMediator
}

class TopicController {
  mediator: TopicsMediator
  /**
     * Creates the TopicController
     * @param config the TopicsControllerConfig- the mediator is injected into the controller as a dependency.
     */
  constructor (config: TopicControllerConfig) {
    this.mediator = config.Mediator
  }

  /**
     * GetReceiveTopics retrieves the current topics inside of the database and returns them to the user.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise. Returns data directly to request as JSON [{id: number, name: String, description: string, imageUrl: string},{...}]
     */
  GetReceiveTopics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let responseObj: any[] = []
    try {
      responseObj = await this.mediator.GetReceiveTopics()
    } catch (error: any) {
      logger.error(`TopicController.GetReceiveTopics error ${String(error)}`)
      res.status(500).json({ code: 500, responsse: 'Could not process request' })
    }
    res.status(200).json({ code: 200, response: responseObj })
  }

  /**
     * GetRetreiveTopicsPercentage retrieves the current topic's percentage learned inside of the database and returns them to the user.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise. Returns data directly to request as JSON i.e [percentageLearned : 0.93]
     */
  GetReceiveTopicsPercentage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.params.topicName == null) {
      res.status(400).json({ code: 400, response: 'No topic found' })
      return
    }
    if (req.session.accountId === undefined) {
      res.status(500).json({ code: 500, response: 'Must be authorized' })
    } else {
      try {
        const responseObj = await this.mediator.GetReceiveTopicsPercentage(req.session.accountId, req.params.topicName)
        res.status(200).json({ code: 200, response: responseObj })
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`TopicController.GetReceiveTopicsPercentage error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }

  /**
     * GetRetreiveTopicsPractice retrieves the current topic's words that a user needs to practice the most.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise. Returns data directly to request as JSON [{id: number, name: String, description: string, imageUrl: string},{...}]
     */
  GetReceiveTopicsPractice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.params.topicName == null) {
      res.status(400).json({ code: 400, response: 'No topic found' })
      return
    }
    if (req.session.accountId === undefined) {
      res.status(500).json({ code: 500, response: 'Must be authorized' })
    } else {
      try {
        const responseObj = await this.mediator.GetReceiveTopicsPractice(req.session.accountId, req.params.topicName, 6)
        res.status(200).json({ code: 200, response: responseObj })
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`TopicController.GetReceiveTopicsPractice error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }

  /**
     * PostReceiveCards retrieves the current cards the user has to stufy from inside of the database and returns them to the user.
     * @param req the Express request
     * @param res the Express response
     * @param next the next middleware
     * @returns a void promise. Returns data directly to request as JSON
     */
  PostReceiveCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body == null) {
      res.status(400).json({ code: 400, response: 'No body found' })
      return
    }
    if (req.session.accountId === undefined) {
      res.status(500).json({ code: 500, response: 'Must be authorized' })
    } else {
      let requestObj: ReceiveCardsRequest
      try {
      // No errors were thrown. user successfully authenticated.
        requestObj = ReceiveCardsRequest.parse(req.body)
        const responseObj = await this.mediator.PostReceiveCards(req.session, (Math.floor(new Date().getTime() / 1000.0)), requestObj)
        res.status(200).json({ code: 200, response: responseObj })
      } catch (error) {
        if (error instanceof Error) {
          if (error === InvalidCredentialsError) {
            logger.warn(`TopicController.PostReceiveCards invalid-login ${error.toString()}`)
            res.status(401).json({ code: 500, response: 'Must be authorized.' })
            return
          }
          logger.error(`TopicController.PostReceiveCards error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }

  PostSaveCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body == null) {
      res.status(400).json({ code: 400, response: 'No body found' })
      return
    }
    if (req.session.accountId === undefined) {
      res.status(500).json({ code: 500, response: 'Must be authorized' })
    } else {
      let requestObj: SaveCardRequest
      try {
      // No errors were thrown. user successfully authenticated.
        requestObj = SaveCardRequest.parse(req.body)
        await this.mediator.PostSaveCard(req.session, (Math.floor(new Date().getTime() / 1000.0)), requestObj)
        res.status(200).json({ code: 200, response: 'Saved' })
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`TopicController.PostSaveCard error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }

  PostReportCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body == null) {
      res.status(400).json({ code: 400, response: 'No body found' })
      return
    }
    if (req.session.accountId === undefined) {
      res.status(500).json({ code: 500, response: 'Must be authorized' })
    } else {
      let requestObj: ReportCardRequest
      try {
      // No errors were thrown. user successfully authenticated.
        requestObj = ReportCardRequest.parse(req.body)
        await this.mediator.PostReportCard(req.session, requestObj)
        res.status(200).json({ code: 200, response: 'Saved' })
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`TopicController.PostReportCard error ${error.toString()}`)
          res.status(400).json({ code: 400, error: error.message })
        }
      }
    }
  }
}
export default TopicController
