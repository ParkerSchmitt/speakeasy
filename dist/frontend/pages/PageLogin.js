"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("@fortawesome/fontawesome-free/css/all.min.css");
require("mdb-react-ui-kit/dist/css/mdb.min.css");
const mdb_react_ui_kit_1 = require("mdb-react-ui-kit");
function PageLogin() {
    return (<mdb_react_ui_kit_1.MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>

      <mdb_react_ui_kit_1.MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <mdb_react_ui_kit_1.MDBCol col='12'>

        <h3 className="my-5 text-center" style={{ fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>

          <mdb_react_ui_kit_1.MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <mdb_react_ui_kit_1.MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className=" mt-0 mb-0 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' type='email' size="lg"/>
              <mdb_react_ui_kit_1.MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' type='password' size="lg"/>

              <mdb_react_ui_kit_1.MDBCheckbox name='flexCheck' id='flexCheckDefault' className='mb-4' label='Remember password'/>

              <mdb_react_ui_kit_1.MDBBtn size='lg'>
                Login
              </mdb_react_ui_kit_1.MDBBtn>
              <p className="mt-5 text-center">Not a user yet? <a href="/register"> Register!</a> </p>

            </mdb_react_ui_kit_1.MDBCardBody>
          </mdb_react_ui_kit_1.MDBCard>

        </mdb_react_ui_kit_1.MDBCol>
      </mdb_react_ui_kit_1.MDBRow>

    </mdb_react_ui_kit_1.MDBContainer>);
}
exports.default = PageLogin;
//# sourceMappingURL=PageLogin.js.map