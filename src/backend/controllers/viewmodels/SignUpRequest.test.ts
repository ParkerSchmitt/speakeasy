import  {MissingEmailError,InvalidEmailError,InvalidEmailTypeError,MissingFirstNameError,InvalidFirstNameTypeError, MissingLastNameError, InvalidLastNameTypeError, MissingPasswordError, InvalidPasswordTypeError, Convert} from './SignUpRequest';


describe("SignUpRequest", () => {
    // Makes sure all errors are correct
    it.each([
        [{'firstName': 'John', 'lastName': 'Doe', 'password': '1234Password'}, MissingEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 22, 'password': '1234Password'}, InvalidEmailTypeError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.d@d', 'password': '1234Password'}, InvalidEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'test@test', 'password': '1234Password'}, InvalidEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': '@gmail.com', 'password': '1234Password'}, InvalidEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'testi@.com', 'password': '1234Password'}, InvalidEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'x'.repeat(365) + '@gmail.com', 'password': '1234Password'}, InvalidEmailError], // Over max length of email allowed via RFC spec
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'test@x.x', 'password': '1234Password'}, InvalidEmailError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': '.!@gmail.com', 'password': '1234Password'}, InvalidEmailError], 

        [{'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, MissingFirstNameError],
        [{'firstName': 22, 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, InvalidFirstNameTypeError],

        [{'firstName': 'John', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, MissingLastNameError],
        [{'firstName': 'John', 'lastName': 22, 'email': 'john.doe@gmail.com', 'password': '1234Password'}, InvalidLastNameTypeError],

        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com'}, MissingPasswordError],
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': 22}, InvalidPasswordTypeError]
      ])(
        `should return proper error given invalid json object`,
        (json, error) => {
          expect(() => {Convert.toSignUpRequest(json)}).toThrowError(error);
        }
      );

    // Makes sure all correct requests are transformed correctly
    it.each([
        [{'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}, {'firstName': 'John', 'lastName': 'Doe', 'email': 'john.doe@gmail.com', 'password': '1234Password'}],
        [{'firstName': 'Peter', 'lastName': 'Parker', 'email': 'test@test.com', 'password': 'SafePassword'}, {'firstName': 'Peter', 'lastName': 'Parker', 'email': 'test@test.com', 'password': 'SafePassword'}],
        [{'firstName': 'ALongFirstname', 'lastName': 'ALongLastname', 'email': 'x'.repeat(60)+'@gmail.com', 'password': 'RedBLUE'}, {'firstName': 'ALongFirstname', 'lastName': 'ALongLastname', 'email': 'x'.repeat(60)+'@gmail.com', 'password': 'RedBLUE'}],

      ])(
        `should return proper structure given json request`,
        (json, conversion) => {
          expect(Convert.toSignUpRequest(json)).toEqual(conversion);
        }
      );
});