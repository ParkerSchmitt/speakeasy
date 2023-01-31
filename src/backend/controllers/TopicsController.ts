import { type Request, type Response, type NextFunction } from 'express'
import type TopicsMediator from '../mediators/TopicsMediator'

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
    } catch (error) {
      res.status(500).json({ code: 500, responsse: 'Could not process request' })
    }
    res.status(200).json({ code: 200, response: responseObj })
  }
}

export default TopicController
