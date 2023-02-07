import { Database } from 'sqlite3'; /*eslint: ignore */
import TopicRepository from './TopicRepository';

describe('TopicRepository',  () => {
    let TopicRepositoryCorrectTable : TopicRepository
    let database = new Database(':memory:')

    it('should create database in memory', async () => {

    await new Promise<void>((resolve,reject) => {database.exec("CREATE TABLE topics (id INTEGER PRIMARY KEY, name nvarchar(32), description nvarchar(255), imageUrl nvarchar(255))", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })
    await new Promise<void>((resolve,reject) => {database.exec("CREATE TABLE cards (id INTEGER PRIMARY KEY, topicId INTEGER, name nvarchar(32), targetLanguageWord nvarchar(64), nativeLanguageWord nvarchar(64))", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })
    await new Promise<void>((resolve,reject) => {database.exec("CREATE TABLE cards_accounts(id INTEGER PRIMARY KEY, card_id INTEGER, account_id INTEGER, easiness DECIMAL(10,3), interval INTEGER, repetitions INTERVAL, datetime INTEGER)", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })

    await new Promise<void>((resolve,reject) => { database.exec("INSERT INTO topics(name, description, imageurl) VALUES ('Test', 'Test Description', 'Test Image URL')", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })
    await new Promise<void>((resolve,reject) => { database.exec("INSERT INTO cards(topicId, name, targetLanguageWord, nativeLanguageWord) VALUES (1, 'Test Card', 'Casa', 'Home'), (1, 'Test Card 2', 'Bueno', 'Good'), (1, 'Test Card 3', 'Aqua', 'Water')", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })
    await new Promise<void>((resolve,reject) => { database.exec("INSERT INTO cards_accounts(card_id, account_id, easiness, interval, repetitions, datetime) VALUES (1,1,5.3,5,3, 1675734233)", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })        


     TopicRepositoryCorrectTable = new TopicRepository({
        topicTableName: 'topics',
        cardTableName: 'cards',
        cardAccountLinkageTableName: 'cards_accounts',
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
        ['Test', 1, 0, [{"id": 1, "nativeLanguageWord": "Home", "targetLanguageWord": "Casa"}]],
        ['Test', 1, 1, [{"id": 2, "nativeLanguageWord": "Good", "targetLanguageWord": "Bueno"}]],
        ['Test', 2, 1, [{"id": 2, "nativeLanguageWord": "Good", "targetLanguageWord": "Bueno"}, {"id": 3, "nativeLanguageWord": "Water", "targetLanguageWord": "Aqua"}]],
        ['Test', 3, 0, [{"id": 1, "nativeLanguageWord": "Home", "targetLanguageWord": "Casa"},{"id": 2, "nativeLanguageWord": "Good", "targetLanguageWord": "Bueno"}, {"id": 3, "nativeLanguageWord": "Water", "targetLanguageWord": "Aqua"}]],
    ])(
        `should retrieve the cards from the database`,
        async (topic, amount, offset, expectedObject) => {
            const result = await TopicRepositoryCorrectTable.receiveNewCards(topic,amount,offset);
            expect(result).toEqual(expectedObject);

        }
    );

    // Makes sure it retrieves the existing (learned) cards form the database.
    it.each([
        ['Test', 1, 1, 1675820631, [{"id": 1, "nativeLanguageWord": "Home", "targetLanguageWord": "Casa"}]],
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

});
