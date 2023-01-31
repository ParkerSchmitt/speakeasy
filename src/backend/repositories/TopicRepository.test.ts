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

    await new Promise<void>((resolve,reject) => { database.exec("INSERT INTO topics(name, description, imageurl) VALUES ('Test', 'Test Description', 'Test Image URL')", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })


     TopicRepositoryCorrectTable = new TopicRepository({
        topicTableName: 'topics',
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
});
