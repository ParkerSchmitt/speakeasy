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


     TopicRepositoryCorrectTable = new TopicRepository({
        topicTableName: 'topics',
        cardTableName: 'cards',
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

});
