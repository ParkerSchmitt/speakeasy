import {InvalidWordsPerDayTypeError, InvalidFirstNameTypeError, InvalidLastNameTypeError, InvalidSendEmailLessonAbsesnceTypeError, InvalidShowAddedTimeInButtonTypeError, PatchAccountInfoRequest} from './PatchAccountInfoRequest';


describe("PatchAccountInfoRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'wordsPerDay': 3.2}, InvalidWordsPerDayTypeError], //We can't patch update wordsPerDay as a fraction.
        [{'wordsPerDay': '3.2'}, InvalidWordsPerDayTypeError],
        [{'wordsPerDay': true}, InvalidWordsPerDayTypeError],
        [{'firstName': 3.2}, InvalidFirstNameTypeError],
        [{'firstName': true}, InvalidFirstNameTypeError],
        [{'lastName': 3.2}, InvalidLastNameTypeError],
        [{'lastName': true}, InvalidLastNameTypeError],
        [{'sendEmailLessonAbsesnce': 'true'}, InvalidSendEmailLessonAbsesnceTypeError],
        [{'sendEmailLessonAbsesnce': 2}, InvalidSendEmailLessonAbsesnceTypeError],
        [{'showAddedTimeInButton': 'true'}, InvalidShowAddedTimeInButtonTypeError],
        [{'showAddedTimeInButton': 2}, InvalidShowAddedTimeInButtonTypeError],
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {PatchAccountInfoRequest.parse(json)}).toThrowError(error);
        }
      );
});