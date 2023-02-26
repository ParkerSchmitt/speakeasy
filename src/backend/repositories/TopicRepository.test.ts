import DatabaseMock from '../mocks/DatabaseMock'; /*eslint: ignore */
import TopicRepository from './TopicRepository';

describe('TopicRepository',  () => {
    let TopicRepositoryCorrectTable : TopicRepository
    let database = new DatabaseMock()

    it('should create repository in memory', async () => {
     TopicRepositoryCorrectTable = new TopicRepository({
        topicTableName: 'topics',
        cardTableName: 'cards',
        cardAccountLinkageTableName: 'cards_accounts',
        cardReportTableName: 'cards_reports',
        database: database,
    })
    });

    // Makes sure it retrieves the topic form the database.
    it.each([
        [[{id: 1, name: 'Test', description: 'Test Description', imageUrl: 'Test Image URL' }]],

    ])(
        `should retrieve the topics from the database`,
        async (topicObject) => {
            const result = await TopicRepositoryCorrectTable.receiveTopics();
            expect(result).toEqual(topicObject);

        }
    );

    // Makes sure it retrieves the cards form the database.
    it.each([
        ['Test', 1, 0, [{ "id": 1, "revealText": "Home", "previewText": "Casa", "imageUrl": "test/url.png", "pronunciation": "cah-sah", "topicId": 1, "audioUrl": "test/url.wav" }]],
        ['Test', 1, 1, [{ "audioUrl": "test/url.wav", "id": 2, "imageUrl": "test/url.png", "previewText": "Bueno", "pronunciation": "brewh-no", "revealText": "Good", "topicId": 1}]],
        ['Test', 2, 1, [{ "audioUrl": "test/url.wav", "id": 2, "imageUrl": "test/url.png", "previewText": "Bueno", "pronunciation": "brewh-no", "revealText": "Good", "topicId": 1,}, { "audioUrl": "test/url.wav", "id": 3, "imageUrl": "test/url.png", "previewText": "Aqua", "pronunciation": "wah-ter", "revealText": "Water", "topicId": 1,}]],
        ['Test', 3, 0, [{ "audioUrl": "test/url.wav", "id": 1, "imageUrl": "test/url.png", "previewText": "Casa", "pronunciation": "cah-sah", "revealText": "Home", "topicId": 1 }, { "audioUrl": "test/url.wav", "id": 2, "imageUrl": "test/url.png", "previewText": "Bueno", "pronunciation": "brewh-no", "revealText": "Good", "topicId": 1 }, { "audioUrl": "test/url.wav", "id": 3, "imageUrl": "test/url.png", "previewText": "Aqua", "pronunciation": "wah-ter", "revealText": "Water", "topicId": 1 }]],
    ])(
        `should retrieve the cards from the database`,
        async (topic, amount, offset, expectedObject) => {
            const result = await TopicRepositoryCorrectTable.receiveNewCards(topic,amount,offset);
            expect(result).toEqual(expectedObject);

        }
    );

    // Makes sure it retrieves a existing (learned) cardform the database.
    it.each([
        [ 1, 1, {"id": 1, "topic": "Test", "easiness": 5.3, "datetime": 1675734233, "interval": 5, "repetitions": 3, "previewText": "Casa", "revealText": "Home", "audioUrl": "test/url.wav", "imageUrl": "test/url.png", "pronunciation": "cah-sah", "topicId": 1}],
        [ 1, 100, null],
        [ 1, 444, null], // should be an empty array because the timestamp is less before the timestamp saved
       ])(
        `should retrieve a single card from the database`,
        async (accountId, cardId, expectedObbject) => {
            const result = await TopicRepositoryCorrectTable.receiveStoredCard(accountId,cardId);
            expect(result).toEqual(expectedObbject);

        }
    );    

    // Makes sure it retrieves the existing (learned) cards form the database.
    it.each([
        ['Test', 1, 1, 1675820631, [{"id": 1, "revealText": "Home", "previewText": "Casa", "imageUrl": "test/url.png", "audioUrl": "test/url.wav", "pronunciation": "cah-sah", "topicId": 1,}]],
        ['Test', 1, 0, 1675820631, []],
        ['Test', 1, 1, 1675303131, []], // should be an empty array because the timestamp is less before the timestamp saved
       ])(
        `should retrieve the cards from the database`,
        async (topic, accountId, amount, date, expectedObject) => {
            const result = await TopicRepositoryCorrectTable.receiveStoredCards(topic,accountId,amount,date);
            expect(result).toEqual(expectedObject);

        }
    );

    // Makes sure it retrieves the existing (learned) cards form the database.
    it.each([
        ['Test', 1, 1],
        ['Test', 3, null],
        ['Test', 0, null], // should be an empty array because the timestamp is less before the timestamp saved
       ])(
        `should retrieve the cards from the database`,
        async (topic, accountId, expectedMax) => {
            const result = await TopicRepositoryCorrectTable.receiveMaxCardReached(topic, accountId);
            expect(result).toEqual(expectedMax);

        }
    );

    // Makes sure it updates a card correctly
    it.each([
        [1,1,6,7,3, 1675734233],
        [1,1,5.3,5,3, 1675734231],

       ])(
        `should update learned card information`,
        async (cardId, accountId, easiness, interval, repetitions, date) => {
            await TopicRepositoryCorrectTable.updateLearnedCard(cardId, accountId, easiness, interval, repetitions, date);
            
            //Now query the database and see if it updated
            const query = `SELECT card_id, account_id, easiness, interval, repetitions, datetime FROM ${TopicRepositoryCorrectTable.cardAccountLinkageTableName} WHERE card_id =$cardId AND account_id = $accountId `;
            let rows  = await new Promise<any[]>((resolve,reject) => {database.all(query,{
                '$cardId': cardId,
                '$accountId': accountId
            }, (error, result) => {
                if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
            })
        })
            expect(rows.length).toEqual(1);
            expect(rows[0].card_id).toEqual(cardId);
            expect(rows[0].account_id).toEqual(accountId);
            expect(rows[0].easiness).toEqual(easiness);
            expect(rows[0].interval).toEqual(interval);
            expect(rows[0].repetitions).toEqual(repetitions);
            expect(rows[0].datetime).toEqual(date);
        }
    );

        // Makes sure it inserts a card correctly
        it.each([
            [2,1,6,7,3, 1675734233],
            [3,1,5.3,5,3, 1675734231],
           ])(
            `should insert learned card information`,
            async (cardId, accountId, easiness, interval, repetitions, date) => {
                await TopicRepositoryCorrectTable.insertLearnedCard(cardId, accountId, easiness, interval, repetitions, date);
                
                //Now query the database and see if it updated
                const query = `SELECT card_id, account_id, easiness, interval, repetitions, datetime FROM ${TopicRepositoryCorrectTable.cardAccountLinkageTableName} WHERE card_id =$cardId AND account_id = $accountId `;
                let rows  = await new Promise<any[]>((resolve,reject) => {database.all(query,{
                    '$cardId': cardId,
                    '$accountId': accountId
                }, (error, result) => {
                    if (error) {
                        reject(error)
                      } else {
                        resolve(result)
                      }
                })
            })
                expect(rows.length).toEqual(1);
                expect(rows[0].card_id).toEqual(cardId);
                expect(rows[0].account_id).toEqual(accountId);
                expect(rows[0].easiness).toEqual(easiness);
                expect(rows[0].interval).toEqual(interval);
                expect(rows[0].repetitions).toEqual(repetitions);
                expect(rows[0].datetime).toEqual(date);
            }
        );

     // Makes sure it inserts a card correctly
     it.each([
        [1,1,'reveal','incorrect','Spelled wrong'],
       ])(
        `should insert card report`,
        async (cardId, accountId, type, reason, comment) => {
            await TopicRepositoryCorrectTable.insertReportCart(cardId, accountId, type, reason, comment);
            
            //Now query the database and see if it updated
            const query = `SELECT card_id, account_id, type, reason, comment FROM ${TopicRepositoryCorrectTable.cardReportTableName} WHERE card_id =$cardId AND account_id = $accountId `;
            let rows  = await new Promise<any[]>((resolve,reject) => {database.all(query,{
                '$cardId': cardId,
                '$accountId': accountId
            }, (error, result) => {
                if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
            })
        })
            expect(rows.length).toEqual(1);
            expect(rows[0].card_id).toEqual(cardId);
            expect(rows[0].account_id).toEqual(accountId);
            expect(rows[0].type).toEqual(type);
            expect(rows[0].reason).toEqual(reason);
            expect(rows[0].comment).toEqual(comment);
        }
    );
        
});
