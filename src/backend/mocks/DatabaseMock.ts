import { Database } from 'sqlite3' /* eslint: ignore */

export default class DatabaseMock extends Database {
  constructor () {
    super(':memory:')

    this.exec('CREATE TABLE topics (id INTEGER PRIMARY KEY, name nvarchar(32), description nvarchar(255), imageUrl nvarchar(255))', (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec('CREATE TABLE cards (id INTEGER PRIMARY KEY, topicId INTEGER, name nvarchar(32), previewText nvarchar(64), revealText nvarchar(64), pronunciation nvarchar(64), imageUrl varchar(64), audioUrl varchar(64))', (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec('CREATE TABLE cards_accounts(id INTEGER PRIMARY KEY, card_id INTEGER, account_id INTEGER, easiness DECIMAL(10,3), interval INTEGER, repetitions INTERVAL, datetime INTEGER)', (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec('CREATE TABLE cards_accounts(id INTEGER PRIMARY KEY, card_id INTEGER, account_id INTEGER, easiness DECIMAL(10,3), interval INTEGER, repetitions INTERVAL, datetime INTEGER)', (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec("INSERT INTO topics(name, description, imageurl) VALUES ('Test', 'Test Description', 'Test Image URL')", (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec("INSERT INTO cards(topicId, name, previewText, revealText, imageUrl, audioUrl, pronunciation) VALUES (1, 'Test Card', 'Casa', 'Home', 'test/url.png', 'test/url.wav', 'cah-sah'), (1, 'Test Card 2', 'Bueno', 'Good', 'test/url.png', 'test/url.wav', 'brewh-no'), (1, 'Test Card 3', 'Aqua', 'Water', 'test/url.png', 'test/url.wav', 'wah-ter')", (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
    this.exec('INSERT INTO cards_accounts(card_id, account_id, easiness, interval, repetitions, datetime) VALUES (1,1,5.3,5,3, 1675734233)', (err: any) => {
      if (err !== null) {
        console.log(err)
      }
    })
  }
}
