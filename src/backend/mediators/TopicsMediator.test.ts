import session, { Cookie, Session } from 'express-session';
import { ReceiveCardsRequest } from '../controllers/viewmodels/ReceiveCardsRequest';
import DatabaseMock from '../mocks/DatabaseMock'; /*eslint: ignore */
import TopicRepository from '../repositories/TopicRepository';
import { CardAccountType } from '../types/CardAccountType';
import TopicMediator from './TopicsMediator';
import TopicsMediator from './TopicsMediator';

declare module 'express-session' {
    interface SessionData {
      accountId: number
      activeReviews: Record<string, CardAccountType[]> // topic: string, Cards to review: CardType[]:
    }
  }

describe('TopicMediator',  () => {
    let TopicMediatorCorrectTable : TopicsMediator
    let database = new DatabaseMock()

    it('should create repository in memory', async () => {
     TopicMediatorCorrectTable = new TopicMediator({
        MaxCards: 5,
        Repository:  new TopicRepository ({
        topicTableName: 'topics',
        cardTableName: 'cards',
        cardAccountLinkageTableName: 'cards_accounts',
        database: database,
        })
    })
    });

    // Makes sure it retrieves the topic form the database.
    it.each([
        [[{id: 1, name: 'Test', description: 'Test Description', imageUrl: 'Test Image URL' }]],

    ])(
        `should retrieve the topics from the database`,
        async (topicObject) => {
            const result = await TopicMediatorCorrectTable.GetReceiveTopics();
            expect(result).toEqual(topicObject);

        }
    );

    // Makes sure it retrieves the cards form the database.
    it.each([
        ['Test', 1, 0, [{"audioUrl": "test/url.wav", "id": 1, "imageUrl": "test/url.png", "previewText": "Casa", "pronunciation": "cah-sah", "revealText": "Home", "scheduledCard": false, "topicId": 1 }]],
    ])(
        `should retrieve the cards from the database`,
        async (topic, amount, offset, expectedObject) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: 2,
                activeReviews: undefined,
                cookie: new Cookie,
                regenerate: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                destroy: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                reload: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                resetMaxAge: function (): session.Session {
                    throw new Error('Function not implemented.');
                },
                save: function (callback?: ((err: any) => void) | undefined): session.Session {
                    throw new Error('Function not implemented.');
                },
                touch: function (): session.Session {
                    throw new Error('Function not implemented.');
                }
            }

            let request: ReceiveCardsRequest = {
                amount: amount,
                topic: topic
            }

            const result = await TopicMediatorCorrectTable.PostReceiveCards(session, request);
            expect(result).toEqual(expectedObject);

        }
    );

    // Makes sure it retrieves a existing (learned) cardform the database.
    it.each([
        [ 1, 1, [{"audioUrl": "test/url.wav", "id": 1, "imageUrl": "test/url.png", "previewText": "Casa", "pronunciation": "cah-sah", "revealText": "Home", "scheduledCard": false, "topicId": 1}]],
       ])(
        `should retrieve a single card from the database`,
        async (accountId, cardId, expectedObbject) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: 2,
                activeReviews: undefined,
                cookie: new Cookie,
                regenerate: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                destroy: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                reload: function (callback: (err: any) => void): session.Session {
                    throw new Error('Function not implemented.');
                },
                resetMaxAge: function (): session.Session {
                    throw new Error('Function not implemented.');
                },
                save: function (callback?: ((err: any) => void) | undefined): session.Session {
                    throw new Error('Function not implemented.');
                },
                touch: function (): session.Session {
                    throw new Error('Function not implemented.');
                }
            }

            let request: ReceiveCardsRequest = {
                amount: 1,
                topic: 'Test'
            }

            const result = await TopicMediatorCorrectTable.PostReceiveCards(session,request);
            expect(result).toEqual(expectedObbject);

        }
    );    
});
