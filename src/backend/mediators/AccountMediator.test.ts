import session, { Cookie, Session } from 'express-session';
import { ReceiveCardsRequest } from '../controllers/viewmodels/ReceiveCardsRequest';
import { SaveCardRequest } from '../controllers/viewmodels/SaveCardRequest';
import DatabaseMock from '../mocks/DatabaseMock'; /*eslint: ignore */
import { MailerMock } from '../mocks/MailerMock'; /*eslint: ignore */

import AccountRepository from '../repositories/AccountRepository';
import { CardAccountType } from '../types/CardAccountType';
import AccountMediator, { AccountExistsError, InvalidCredentialsError, InvalidTokenError } from './AccountMediator'
import { type Client } from 'pg';
import { Mailer } from '../utils/mailer/Mailer';

declare module 'express-session' {
    interface SessionData {
      accountId: number
      activeReviews: Record<string, CardAccountType[]> // topic: string, Cards to review: CardType[]:
    }
  }

describe('AccountMediator',  () => {
    let AccountMediatorCorrectTable : AccountMediator
    let AccountMediatorInvalidTable : AccountMediator

    let client : Client = new DatabaseMock() as Client

      AccountMediatorCorrectTable = new AccountMediator({
        Repository:  new AccountRepository ({
        tableName: 'accounts',
        client: client,
        }),
        Mailer: new MailerMock({SENDGRID_API_KEY: "testKey"}) as Mailer
      })

      AccountMediatorInvalidTable = new AccountMediator({
        Repository:  new AccountRepository ({
        tableName: 'badTable',
        client: client,
        }),
        Mailer: new MailerMock({SENDGRID_API_KEY: "testKey"}) as Mailer
      })


    // Makes sure all requests are interpreted correctly
    it.each([
      [{ 'email': "test@test.com", 'password': '1234', 'firstName': 'John', 'lastName': 'Doe'}, AccountMediatorInvalidTable, Error],
      [{ 'email': "duplicate@test.com", 'password': '1234', 'firstName': 'John', 'lastName': 'Doe' }, AccountMediatorCorrectTable, AccountExistsError],
    ])(
      `should return error errors if can't signup account into table`,
      async (viewmodel, mediator, error) => {
          await expect(async () => {
              await mediator.PostReceiveSignup(viewmodel);
          }).rejects.toThrowError(error);
      })

    // Makes sure that invalid login requests are interepted correctly
    it.each([
      [{ 'email': 'invalid.table@test.com', 'password': '1234'}, AccountMediatorInvalidTable, Error],
      [{ 'email': "email.does.not.exist@test.com", 'password': '1234'}, AccountMediatorCorrectTable, InvalidCredentialsError],
      [{ 'email': "duplicate@test.com", 'password': 'invalidPassword'}, AccountMediatorCorrectTable, InvalidCredentialsError],
    ])(
      `should return error errors if can't login user into table`,
      async (viewmodel, mediator, error) => {
          await expect(async () => {
              await mediator.PostReceiveSignin(viewmodel);
          }).rejects.toThrowError(error);
      })

    // Makes sure that email verification token requests are interepted correctly
    it.each([
      ["testToken", AccountMediatorInvalidTable, Error], //token exists from mock but invalid table so should error
      ["badToken", AccountMediatorCorrectTable, InvalidTokenError],
    ])(
      `should return error errors if can't login user into table`,
      async (token, mediator, error) => {
          await expect(async () => {
              await mediator.GetVerifyEmail(token);
          }).rejects.toThrowError(error);
      })
});
