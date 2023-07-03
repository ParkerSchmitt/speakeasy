import React, { type ReactElement, useState, type FormEvent } from 'react'
import * as EmailValidator from 'email-validator'
import { useNavigate } from 'react-router-dom'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '.././Config'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBValidationItem,
  MDBValidation
}
  from 'mdb-react-ui-kit'

function PageRegister (): ReactElement {
  const [firstName, setFirstName] = useState('')
  const [firstNameFlag, setFirstNameFlag] = useState(false)
  const [lastName, setLastName] = useState('')
  const [lastNameFlag, setLastNameFlag] = useState(false)
  const [email, setEmail] = useState('')
  const [emailFlag, setEmailFlag] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordFlag, setPasswordFlag] = useState(false)
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [passwordRepeatFlag, setPasswordRepeatFlag] = useState(false)
  const navigate = useNavigate()

  /**
   * Validates the input to see if it is correct, and sets the state of the input
   * @param indicator boolean, if it is valid or not
   * @param target the event target to set the valadility of.
   * @param funcSetInput the value that we are changing the state of
   * @param funcSetInputFlag the flag that corresponds to the input. Used to determine input is modified and if a warning should even be displayed.
   */
  const validateInput = (indicator: boolean, target: HTMLInputElement, funcSetInput: (val: string) => void, funcSetInputFlag: (val: boolean) => void): void => {
    if (indicator) {
      funcSetInput(target.value)
      funcSetInputFlag(true)
      target.setCustomValidity('invalid')
      target.reportValidity()
    } else {
      funcSetInputFlag(true)
      funcSetInput(target.value)
      target.setCustomValidity(''); target.reportValidity()
    }
  }

  /**
   * Handles form submission from the login sceen and attempts to login the user.
   * @param e  the form event.
   */
  const handleSubmission = (e: FormEvent<HTMLFormElement>): void => {
    fetch(`${Config.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        password
      })
    })
      .then(async response => {
        if (response.status === 200) {
          navigate('/login')
        }
      }).catch((error) => {
        throw error
      })
    e.preventDefault()
  }

  return (
    <MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <h3 className="my-5 text-center" style={{ color: '#3B71CA', fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <form onSubmit={handleSubmission}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                <h2 className=" mt-0 mb-4 text-center">Register</h2>
                  <MDBValidation className={'row g-3 ' + (firstNameFlag ? 'was-validated' : '') }>
                    <MDBValidationItem feedback='Please enter your first name.' invalid={firstNameFlag} >
                      <MDBInput wrapperClass='mb-4 w-100' label='First Name' id='formControlLg' defaultValue={firstName} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setFirstName, setFirstNameFlag) } } type='text' size="lg" required/>
                    </MDBValidationItem>
                  </MDBValidation>

                  <MDBValidation className={'row g-3 ' + (lastNameFlag ? 'was-validated' : '') }>
                    <MDBValidationItem feedback='Please choose your last name.' invalid={lastNameFlag}>
                      <MDBInput wrapperClass='mb-4 w-100' label='Last Name' id='formControlLg' defaultValue={lastName} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setLastName, setLastNameFlag) } } type='text' size="lg"/>
                      </MDBValidationItem>
                  </MDBValidation>

                  <MDBValidation className={'row g-3 ' + (emailFlag ? 'was-validated' : '') }>
                    <MDBValidationItem feedback='Please enter a valid email address.' invalid={emailFlag}>
                      <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' defaultValue={email} onChange={ (e) => { validateInput(!(EmailValidator.validate(e.target.value)), e.target, setEmail, setEmailFlag) } } type='email' size="lg"/>
                    </MDBValidationItem>
                  </MDBValidation>

                  <MDBValidation className={'row g-3 ' + (passwordFlag ? 'was-validated' : '') }>
                    <MDBValidationItem feedback='Please enter a password.' invalid={ passwordFlag }>
                      <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' defaultValue={password} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setPassword, setPasswordFlag) } } type='password' size="lg"/>
                    </MDBValidationItem>
                  </MDBValidation>

                  <MDBValidation className={'row g-3 ' + (passwordRepeatFlag ? 'was-validated' : '') }>
                    <MDBValidationItem feedback='Please make the password match the one above.' invalid={ passwordRepeatFlag }>
                      <MDBInput wrapperClass='mb-4 w-100' label='Confirm Password' id='formControlLg' defaultValue={passwordRepeat} onChange={ (e) => { validateInput((e.target.value !== password), e.target, setPasswordRepeat, setPasswordRepeatFlag) } } type='password' size="lg"/>
                    </MDBValidationItem>
                  </MDBValidation>

                  <MDBBtn type='submit' color='dark' size='lg' disabled={ !(firstName.length > 0 && lastName.length > 0 && EmailValidator.validate(email) && password === passwordRepeat) }>
                    Register
                  </MDBBtn>
                <p className="mt-5 text-center">Already a user?<a href="/login"> Login!</a> </p>

              </MDBCardBody>
            </form>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  )
}

export default PageRegister
