import session, { Cookie, Session } from 'express-session';
import { ReceiveCardsRequest } from '../controllers/viewmodels/ReceiveCardsRequest';
import { SaveCardRequest } from '../controllers/viewmodels/SaveCardRequest';
import DatabaseMock from '../mocks/DatabaseMock'; /*eslint: ignore */
import TopicRepository from '../repositories/TopicRepository';
import { CardAccountType } from '../types/CardAccountType';
import TopicMediator from './TopicMediator';
import TopicsMediator from './TopicMediator';

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

    // Makes sure it retrieves new (not learned) cards form the database.
    it.each([
        ['Test', 1, 0, [{"audioUrl": "test/url.wav", "id": 1, "imageUrl": "test/url.png", "previewText": "Casa", "pronunciation": "cah-sah", "revealText": "Home", "scheduledCard": false, "topicId": 1 }]],
    ])(
        `should retrieve not learned cards from the database`,
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

            const result = await TopicMediatorCorrectTable.PostReceiveCards(session, 1775734233, request);
            expect(result).toEqual(expectedObject);

        }
    );

    // Makes sure it retrieves a existing (learned) cardform the database.
    it.each([
        [ 1, 1, [{"audioUrl": "test/url.wav", "id": 1, "imageUrl": "test/url.png", "previewText": "Casa", "pronunciation": "cah-sah", "revealText": "Home", "scheduledCard": true, "topicId": 1}]],
       ])(
        `should retrieve a single learned card from the database`,
        async (accountId, amount, expectedObbject) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: accountId,
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
                topic: 'Test'
            }
            const result = await TopicMediatorCorrectTable.PostReceiveCards(session, 1875734233, request);
            expect(result).toEqual(expectedObbject);
        }
    );    


    // Makes sure it inserts a learned card into reviewed storage if quality is 0 or 1
    it.each([
        [ 1, 1, 0, undefined,    { "audioUrl": "test/url.wav",
        "datetime": 1675734233, "easiness": 5.3, "id": 1, "imageUrl": "test/url.png", "interval": 5, "previewText": "Casa", "pronunciation": "cah-sah", "repetitions": 3, "revealText": "Home", "topicId": 1, "topic": "Test"}],
      //Make sure duplicates don't get added.
        [ 1, 1, 0, {"Test": [{ "audioUrl": "test/url.wav",
      "datetime": 1675734233, "easiness": 5.3, "id": 1, "imageUrl": "test/url.png", "interval": 5, "previewText": "Casa", "pronunciation": "cah-sah", "repetitions": 3, "revealText": "Home", "topicId": 1, "topic": "Test"}]},  { "audioUrl": "test/url.wav",
       "datetime": 1675734233, "easiness": 5.3, "id": 1, "imageUrl": "test/url.png", "interval": 5, "previewText": "Casa", "pronunciation": "cah-sah", "repetitions": 3, "revealText": "Home", "topicId": 1, "topic": "Test"}],
    ])(
        `should insert a single learned card into the session review storage`,
        async (accountId, cardId, quality, startingActiveReviews, expectedObject) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: accountId,
                activeReviews: startingActiveReviews,
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
            let request: SaveCardRequest  = {
                cardId: cardId,
                quality: quality,
                topic: 'Test'
            }
            const result = await TopicMediatorCorrectTable.PostSaveCard(session, 1875734233, request);
            expect(session.activeReviews!['Test'].length).toEqual(1);
            expect(session.activeReviews!['Test'][0]).toEqual(expectedObject);
        }
    );    

     // Makes sure it updates a card if it is learned into the db
     it.each([
        [ 1, 2, 3, 1],
        [ 1, 3, 3, 1],

    ])(
        `should insert a single learned card into the data review storage`,
        async (accountId, cardId, quality) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: accountId,
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
            let request: SaveCardRequest  = {
                cardId: cardId,
                quality: quality,
                topic: 'Test'
            }

              const rowAmountBefore = await new Promise<any[]>((resolve, reject) => {
                database.all("SELECT * FROM cards_accounts WHERE account_id = $accountId", {
                  $accountId: accountId
                }, (error, result) => {
                  if (error !== null) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                })
              })

            await TopicMediatorCorrectTable.PostSaveCard(session, 1875734233, request);

            const rowAmountAfter = await new Promise<any[]>((resolve, reject) => {
                database.all("SELECT * FROM cards_accounts WHERE account_id = $accountId", {
                  $accountId: accountId
                }, (error, result) => {
                  if (error !== null) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                })
              })
              expect(rowAmountAfter.length).toBe(rowAmountBefore.length+1);        
        }
    );    

    // Makes sure it doesn't insert a new card (because it should exist already)
    it.each([
        [ 1, 2, 3, 1],
        [ 1, 3, 3, 1],

    ])(
        `should not insert a duplicate learned card into the data review storage`,
        async (accountId, cardId, quality) => {

            let session: Session &  Partial<session.SessionData> = {
                id: '1',
                accountId: accountId,
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
            let request: SaveCardRequest  = {
                cardId: cardId,
                quality: quality,
                topic: 'Test'
            }


              const rowAmountBefore = await new Promise<any[]>((resolve, reject) => {
                database.all("SELECT * FROM cards_accounts WHERE account_id = $accountId", {
                  $accountId: accountId
                }, (error, result) => {
                  if (error !== null) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                })
              })

            await TopicMediatorCorrectTable.PostSaveCard(session, 1875734233, request);

            const rowAmountAfter = await new Promise<any[]>((resolve, reject) => {
                database.all("SELECT * FROM cards_accounts WHERE account_id = $accountId", {
                  $accountId: accountId
                }, (error, result) => {
                  if (error !== null) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                })
              })
              expect(rowAmountAfter.length).toBe(rowAmountBefore.length);        
        }
    );    


});
