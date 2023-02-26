import {InvalidCommentTypeError, InvalidReasonTypeError, InvalidTopicTypeError, InvalidTypeTypeError, MissingCardIdError, MissingCommentError, MissingReasonError, MissingTopicError, MissingTypeError, ReportCardRequest } from './ReportCardRequest';
import { InvalidCardIdTypeError } from './SaveCardRequest';


describe("ReportCardRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'type': 'reveal', 'cardId': 1, 'reason': 'improvement', 'comment': ''}, MissingTopicError],
        [{'topic': 'spanish', 'type': 'reveal', 'reason': 'improvement', 'comment': ''}, MissingCardIdError],
        [{'topic': 'spanish', 'cardId': 1,  'reason': 'improvement', 'comment': ''}, MissingTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'comment': ''}, MissingReasonError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 'improvement'}, MissingCommentError],

        [{'topic': 3, 'cardId': 1, 'type': 'reveal', 'reason': 'improvement', 'comment': ''}, InvalidTopicTypeError],
        [{'topic': 'spanish', 'cardId': "one", 'type': 'reveal', 'reason': 'improvement', 'comment': ''}, InvalidCardIdTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'BAD_TYPE', 'reason': 'improvement', 'comment': ''}, InvalidTypeTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 5, 'reason': 'improvement', 'comment': ''}, InvalidTypeTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 'BAD_TYPE', 'comment': ''}, InvalidReasonTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 5, 'comment': ''}, InvalidReasonTypeError],
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 'improvement', 'comment': 5}, InvalidCommentTypeError],
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {ReportCardRequest.parse(json)}).toThrowError(error);
        }
      );

    // Makes sure all correct requests are transformed correctly
    it.each([
        [{'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 'improvement', 'comment': ''}, {'topic': 'spanish', 'cardId': 1, 'type': 'reveal', 'reason': 'improvement', 'comment': ''}],
        [{'topic': 'spanish', 'cardId': 3, 'type': 'image', 'reason': 'offensive', 'comment': 'd'}, {'topic': 'spanish', 'cardId': 3, 'type': 'image', 'reason': 'offensive', 'comment': 'd'}],
      ])(
        `should return proper structure given json request`,
        (json, conversion) => {
          expect(ReportCardRequest.parse(json)).toEqual(conversion);
        }
      );
});