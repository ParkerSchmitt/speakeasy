import {SaveCardRequest, InvalidCardIdTypeError, InvalidQualityTypeError, InvalidTopicTypeError, MissingCardIdError, MissingQualityError, MissingTopicError } from './SaveCardRequest';


describe("SaveCardRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'topic': 'spanish', 'quality': 4}, MissingCardIdError],
        [{'topic': 'spanish', 'cardId': 1 }, MissingQualityError],
        [{'quality': 3, 'amount': 10}, MissingTopicError],
        [{'topic': 'spanish', 'quality': 4, 'cardId': 0.5}, InvalidCardIdTypeError], //can't save a card that exists as a fraction
        [{'topic': 'spanish', 'cardId': 1, 'quality': 6}, InvalidQualityTypeError],
        [{'topic': 55, 'cardId': 1, 'quality': 3}, InvalidTopicTypeError],
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {SaveCardRequest.parse(json)}).toThrowError(error);
        }
      );

    // Makes sure all correct requests are transformed correctly
    it.each([
        [{'topic': 'spanish', 'cardId': 1, 'quality': 3}, {'topic': 'spanish', 'cardId': 1, 'quality': 3}],
        [{'topic': 'french', 'cardId': 2, 'quality': 0}, {'topic': 'french', 'cardId': 2, 'quality': 0}],
      ])(
        `should return proper structure given json request`,
        (json, conversion) => {
          expect(SaveCardRequest.parse(json)).toEqual(conversion);
        }
      );
});