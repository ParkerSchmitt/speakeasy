import express from "express";
import AccountMediator from "../mediators/AccountMediator";
import DatabaseMock from "../mocks/DatabaseMock";
import AccountRepository from "../repositories/AccountRepository";
import AccountController from "./AccountController";
import request from 'supertest';
import session from "express-session";
import { type Client } from "pg";

describe('AccountController', () => {

  let client: Client = new DatabaseMock() as Client

  const app = express();
  const port = 8080; // default port to listen
  app.use(express.json())

  app.use(session({
    secret: 'TEST',
    resave: false,
    cookie: { maxAge: 100 },
    saveUninitialized: true
  }))

  let accountController : AccountController

  accountController = new AccountController({
    Mediator: new AccountMediator({
      Repository: new AccountRepository({
        client: client,
        tableName: "accounts"
      })
    })
  })

  app.post('/register', accountController.PostReceiveSignup)
  app.post('/authenticate', accountController.PostReceiveSignin)

  // Makes sure all requests are interpreted correctly
  it.each([
    [null, 400],
    [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.d@d', 'password': '1234Password'}, 400], // Invalid formatted email should 400
    [{'firstName': 'John', 'lastName': 'Doe', 'password': '1234Password'}, 400], // Missing email should 400

    [{'firstName': 22, 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, 400], // Invalid formatted first name should 400
    [{'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, 400], // Invalid missing first name should 400

    [{'firstName': 'John', 'lastName': 22, 'email': 'john.doe@gmail.com', 'password': '1234Password'}, 400], // Invalid formatted last name should 400
    [{'firstName': 'John', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, 400], // Invalid missing last name should 400
    [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': 22}, 400], // Invalid formatted password should 400
    [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com'}, 400], // Invalid missing password should 400

    [{ 'firstName': 'John', 'lastName': 'Doe', 'email': 'duplicate@test.com', 'password': '1234Password' }, 200], // duplicate, should return 200 still to not let user know of users already in system
    [{ 'firstName': 'John', 'lastName': 'Doe', 'email': 'properemail@test.com', 'password': '1234Password'  }, 200], // okay request, should return 200
  ])(
    `should return proper structure given json register request`,
    async (json, status) => {

      const res = await request(app)
        .post('/register')
        .send(json)
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

  // Makes sure all requests are interpreted correctly
  it.each([
    [null, 400],
    [{'email': 'john.d@d', 'password': '1234Password'}, 400], // Invalid formatted email should 400
    [{'password': '1234Password'}, 400], // Missing email should 400

    [{'email': 'john.doe@gmail.com', 'password': 22}, 400], // Invalid formatted password should 400
    [{'email': 'john.doe@gmail.com'}, 400], // Invalid missing password should 400

    [{'email': 'duplicate@test.com', 'password': '1234Password' }, 401], // invalid request, should return 401
    [{'email': 'passwordis1234@itis.true', 'password': '1234'  }, 200], // okay request, should return 200

  ])(
    `should return proper structure given authenticate request`,
    async (json, status) => {

      const res = await request(app)
        .post('/authenticate')
        .send(json)
      expect(res.status).toEqual(status);
      expect(res.body).toHaveProperty('code');
    }
  );

})