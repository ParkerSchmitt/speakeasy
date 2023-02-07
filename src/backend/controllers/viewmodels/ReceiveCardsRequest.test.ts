import {InvalidAmountTypeError, InvalidTopicTypeError, MissingAmountError, MissingTopicError, ReceiveCardsRequest} from './ReceiveCardsRequest';


describe("ReceiveCardsRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'topic': 'spanish', 'amount': 10.2}, InvalidAmountTypeError], //We can't request a fraction of a card.
        [{'topic': 'spanish', 'amount': 'hello'}, InvalidAmountTypeError],
        [{'topic': 'spanish', }, MissingAmountError],
        [{'topic': 55, 'amount': 10}, InvalidTopicTypeError],
        [{'amount': 10}, MissingTopicError],
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {ReceiveCardsRequest.parse(json)}).toThrowError(error);
        }
      );

    // Makes sure all correct requests are transformed correctly
    it.each([
        [{'topic': 'spanish', 'amount': 10}, {'topic': 'spanish', 'amount': 10},],
        [{'topic': 'french', 'amount': 5}, {'topic': 'french', 'amount': 5}],
        [{'topic': 'italian', 'amount': 1}, {'topic': 'italian', 'amount': 1}],

      ])(
        `should return proper structure given json request`,
        (json, conversion) => {
          expect(ReceiveCardsRequest.parse(json)).toEqual(conversion);
        }
      );
});