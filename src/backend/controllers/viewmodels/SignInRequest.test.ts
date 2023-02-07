import  {MissingEmailError,InvalidEmailError,InvalidEmailTypeError, MissingPasswordError, InvalidPasswordTypeError, SignInRequest} from './SignInRequest';


describe("SignUpRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'password': '1234Password'}, MissingEmailError],
        [{'email': 22, 'password': '1234Password'}, InvalidEmailTypeError],
        [{'email': 'john.d@d', 'password': '1234Password'}, InvalidEmailError],
        [{'email': 'test@test', 'password': '1234Password'}, InvalidEmailError],
        [{'email': '@gmail.com', 'password': '1234Password'}, InvalidEmailError],
        [{'email': 'testi@.com', 'password': '1234Password'}, InvalidEmailError],
        [{'email': 'x'.repeat(365) + '@gmail.com', 'password': '1234Password'}, InvalidEmailError], // Over max length of email allowed via RFC spec
        [{'email': 'test@x.x', 'password': '1234Password'}, InvalidEmailError],
        [{'email': '.!@gmail.com', 'password': '1234Password'}, InvalidEmailError], 

        [{'email': 'john.doe@gmail.com'}, MissingPasswordError],
        [{'email': 'john.doe@gmail.com', 'password': 22}, InvalidPasswordTypeError]
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {SignInRequest.parse(json)}).toThrowError(error);
        }
      );

    // Makes sure all correct requests are transformed correctly
    it.each([
        [{'email': 'john.doe@gmail.com', 'password': '1234Password'}, {'email': 'john.doe@gmail.com', 'password': '1234Password'}],
        [{'email': 'test@test.com', 'password': 'SafePassword'}, {'email': 'test@test.com', 'password': 'SafePassword'}],
        [{'email': 'x'.repeat(60)+'@gmail.com', 'password': 'RedBLUE'}, {'email': 'x'.repeat(60)+'@gmail.com', 'password': 'RedBLUE'}],

      ])(
        `should return proper structure given json request`,
        (json, conversion) => {
          expect(SignInRequest.parse(json)).toEqual(conversion);
        }
      );
});