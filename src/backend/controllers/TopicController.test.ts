import express from "express";
import TopicMediator from "../mediators/TopicMediator";
import DatabaseMock from "../mocks/DatabaseMock";
import TopicRepository from "../repositories/TopicRepository";
import TopicController from "./TopicController";
import request from 'supertest';
import session, { Cookie, Session } from "express-session";
import { type Client } from "pg";

describe('TopicsController', () => {

  let client = new DatabaseMock() as Client

  const app = express();
  const port = 8080; // default port to listen
  app.use(express.json())

  app.use(session({
    
    secret: 'TEST',
    resave: false,
    cookie: { maxAge: 100 },
    saveUninitialized: true
  }))

  let topicController : TopicController

  topicController = new TopicController({
    Mediator: new TopicMediator({
      MaxCards: 5,
      Repository: new TopicRepository({
        client: client,
        cardAccountLinkageTableName: "cards_accounts",
        topicTableName: "topics",
        cardTableName: "cards",
        cardReportTableName: "cards_reports"
      })
    })
  })

  app.get('/topics', topicController.GetReceiveTopics)
  app.get('/topics/:topicName/percentage', topicController.GetReceiveTopicsPercentage)
  app.get('/topics/:topicName/practice', topicController.GetReceiveTopicsPercentage)
  app.post('/retrieveCards', topicController.PostReceiveCards)
  app.post('/saveCard', topicController.PostSaveCard)
  app.post('/reportCard', topicController.PostReportCard)

  

  it.each([200])(
    `should return proper json structure given retrieveToics request`,
    async (status) => {

      const res = await request(app)
        .get('/topics')
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

  it.each([500])(
    `should return proper json structure given retrieveTopicsPercentageRequest request`,
    async (status) => {

      const res = await request(app)
        .get('/topics/spanish/percentage')
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

    it.each([500])(
    `should return proper json structure given retrieveTopicsPractice request`,
    async (status) => {

      const res = await request(app)
        .get('/topics/spanish/practice')
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

  it.each(
    [
      [ {}, 500 ] // Not logged in 500
    ])(
    `should return proper json structure given retrieveCards request`,
    async (json, status) => {

      const res = await request(app)
        .post('/retrieveCards')
        .send(json)
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

  it.each(
    [
      [ {}, 500 ] // Not logged in 500
    ])(
    `should return proper json structure given saveCard request`,
    async (json, status) => {

      const res = await request(app)
        .post('/saveCard')
        .send(json)
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

  it.each(
    [
      [ {}, 500 ] // Not logged in 500
    ])(
    `should return proper json structure given reportCard request`,
    async (json, status) => {

      const res = await request(app)
        .post('/reportCard')
        .send(json)
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

})