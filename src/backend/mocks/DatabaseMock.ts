import { newDb } from 'pg-mem'
const { Client } = newDb().adapters.createPg()

export default class DatabaseMock extends Client {
  constructor () {
    super({

    })
    // Account SQL

    this.query('CREATE TABLE accounts (id SERIAL, email character varying(320), "firstName" character varying(255), "lastName" character varying(255), "passwordHash" character varying(255), "passwordSalt" character varying(64), "emailVerificationToken" character varying (128), "isEmailAuthenticated" boolean)')

    // eslint-disable-next-line @typescript-eslint/quotes
    this.query(`INSERT INTO accounts (email, "firstName", "lastName", "passwordHash", "passwordSalt", "emailVerificationToken", "isEmailAuthenticated") VALUES('passwordis1234@itis.true','Joe','Adams','fe21dda9e3f5ae922a237f1a8e5d6bc9edde35da229694bec8939c1275cd2748','ad9318d8ddafd4310565870e81e792d6746e05a20f8665d48dfeea3847ff2e53', 'testToken', false), ('duplicate@test.com','Adam','Smith','AAfnsadjni123huh2f3i23r23','sdfdsfds122121f', '', true)`)
    // Topic SQL

    // eslint-disable-next-line @typescript-eslint/quotes
    this.query(`CREATE TABLE topics (id SERIAL, name character varying(32), description character varying(255), "imageUrl" character varying(255))`)
    // eslint-disable-next-line @typescript-eslint/quotes
    this.query(`CREATE TABLE cards (id SERIAL, "topicId" INTEGER, name character varying(32), "previewText" character varying(64), "revealText" character varying(64), pronunciation character varying(64), "imageUrl" character varying(64), "audioUrl" character varying(64))`)
    this.query('CREATE TABLE cards_accounts(id SERIAL, card_id INTEGER, account_id INTEGER, easiness NUMERIC(12,2), interval INTEGER, repetitions INTEGER, datetime INTEGER)')
    // eslint-disable-next-line @typescript-eslint/quotes
    this.query(`INSERT INTO topics(name, description, "imageUrl") VALUES ('Test', 'Test Description', 'Test Image URL')`)
    // eslint-disable-next-line @typescript-eslint/quotes
    this.query(`INSERT INTO cards("topicId", name, "previewText", "revealText", "imageUrl", "audioUrl", pronunciation) VALUES (1, 'Test Card', 'Casa', 'Home', 'test/url.png', 'test/url.wav', 'cah-sah'), (1, 'Test Card 2', 'Bueno', 'Good', 'test/url.png', 'test/url.wav', 'brewh-no'), (1, 'Test Card 3', 'Aqua', 'Water', 'test/url.png', 'test/url.wav', 'wah-ter')`)
    this.query('INSERT INTO cards_accounts(card_id, account_id, easiness, interval, repetitions, datetime) VALUES (1,1,5.3,5,3, 1675734233)')
    this.query('CREATE TABLE cards_reports (id SERIAL, card_id INTEGER, account_id INTEGER, type character varying(10), reason character varying(10), comment character varying(300))')
  }
}
