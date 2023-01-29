"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const EmailValidator = __importStar(require("email-validator"));
require("@fortawesome/fontawesome-free/css/all.min.css");
require("mdb-react-ui-kit/dist/css/mdb.min.css");
const mdb_react_ui_kit_1 = require("mdb-react-ui-kit");
function PageRegister() {
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [firstNameFlag, setFirstNameFlag] = (0, react_1.useState)(false);
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [lastNameFlag, setLastNameFlag] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)('');
    const [emailFlag, setEmailFlag] = (0, react_1.useState)(false);
    const [password, setPassword] = (0, react_1.useState)('');
    const [passwordFlag, setPasswordFlag] = (0, react_1.useState)(false);
    const [passwordRepeat, setPasswordRepeat] = (0, react_1.useState)('');
    const [passwordRepeatFlag, setPasswordRepeatFlag] = (0, react_1.useState)(false);
    const validateInput = (indicator, target, funcSetInput, funcSetInputFlag) => {
        if (indicator) {
            funcSetInput(target.value);
            funcSetInputFlag(true);
            target.setCustomValidity('invalid');
            target.reportValidity();
        }
        else {
            funcSetInputFlag(true);
            funcSetInput(target.value);
            target.setCustomValidity('');
            target.reportValidity();
        }
    };
    return (<mdb_react_ui_kit_1.MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>

      <mdb_react_ui_kit_1.MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <mdb_react_ui_kit_1.MDBCol col='12'>

        <h3 className="my-5 text-center" style={{ fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>

          <mdb_react_ui_kit_1.MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <mdb_react_ui_kit_1.MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className=" mt-0 mb-4 text-center">Register</h2>

              <mdb_react_ui_kit_1.MDBValidation className={'row g-3 ' + (firstNameFlag ? 'was-validated' : '')}>
                <mdb_react_ui_kit_1.MDBValidationItem feedback='Please enter your first name.' invalid={firstNameFlag}>
                  <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='First Name' id='formControlLg' defaultValue={firstName} onChange={(e) => { validateInput((e.target.value.length === 0), e.target, setFirstName, setFirstNameFlag); }} type='text' size="lg" required/>
                </mdb_react_ui_kit_1.MDBValidationItem>
              </mdb_react_ui_kit_1.MDBValidation>

              <mdb_react_ui_kit_1.MDBValidation className={'row g-3 ' + (lastNameFlag ? 'was-validated' : '')}>
                <mdb_react_ui_kit_1.MDBValidationItem feedback='Please choose your last name.' invalid={lastNameFlag}>
                  <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Last Name' id='formControlLg' defaultValue={lastName} onChange={(e) => { validateInput((e.target.value.length === 0), e.target, setLastName, setLastNameFlag); }} type='text' size="lg"/>
                  </mdb_react_ui_kit_1.MDBValidationItem>
              </mdb_react_ui_kit_1.MDBValidation>

              <mdb_react_ui_kit_1.MDBValidation className={'row g-3 ' + (emailFlag ? 'was-validated' : '')}>
                <mdb_react_ui_kit_1.MDBValidationItem feedback='Please enter a valid email address.' invalid={emailFlag}>
                  <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' defaultValue={email} onChange={(e) => { validateInput(!(EmailValidator.validate(e.target.value)), e.target, setEmail, setEmailFlag); }} type='email' size="lg"/>
                 </mdb_react_ui_kit_1.MDBValidationItem>
              </mdb_react_ui_kit_1.MDBValidation>

              <mdb_react_ui_kit_1.MDBValidation className={'row g-3 ' + (passwordFlag ? 'was-validated' : '')}>
                <mdb_react_ui_kit_1.MDBValidationItem feedback='Please enter a password.' invalid={passwordFlag}>
                  <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' defaultValue={password} onChange={(e) => { validateInput((e.target.value.length === 0), e.target, setPassword, setPasswordFlag); }} type='password' size="lg"/>
                </mdb_react_ui_kit_1.MDBValidationItem>
              </mdb_react_ui_kit_1.MDBValidation>

              <mdb_react_ui_kit_1.MDBValidation className={'row g-3 ' + (passwordRepeatFlag ? 'was-validated' : '')}>
                <mdb_react_ui_kit_1.MDBValidationItem feedback='Please make the password match the one above.' invalid={passwordRepeatFlag}>
                  <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Confirm Password' id='formControlLg' defaultValue={passwordRepeat} onChange={(e) => { validateInput((e.target.value !== password), e.target, setPasswordRepeat, setPasswordRepeatFlag); }} type='password' size="lg"/>
                </mdb_react_ui_kit_1.MDBValidationItem>
              </mdb_react_ui_kit_1.MDBValidation>

              <mdb_react_ui_kit_1.MDBBtn size='lg' disabled={!(firstName.length > 0 && lastName.length > 0 && EmailValidator.validate(email) && password === passwordRepeat)}>
                Register
              </mdb_react_ui_kit_1.MDBBtn>
              <p className="mt-5 text-center">Already a user?<a href="/login"> Login!</a> </p>

            </mdb_react_ui_kit_1.MDBCardBody>
          </mdb_react_ui_kit_1.MDBCard>

        </mdb_react_ui_kit_1.MDBCol>
      </mdb_react_ui_kit_1.MDBRow>

    </mdb_react_ui_kit_1.MDBContainer>);
}
exports.default = PageRegister;
//# sourceMappingURL=PageRegister.js.map