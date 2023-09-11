import React, { type FormEvent, useState, type ReactElement } from 'react'
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
  MDBCheckbox,
  MDBValidation,
  MDBValidationItem
}
  from 'mdb-react-ui-kit'

function PageLogin (): ReactElement {
  const [firstName, setFirstName] = useState('')
  const [firstNameFlag, setFirstNameFlag] = useState(false)
  const [lastName, setLastName] = useState('')
  const [lastNameFlag, setLastNameFlag] = useState(false)
  const [newCardsFlag, setNewCardsFlag] = useState(false)
  const [newCards, setNewCards] = useState('')

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
    } else {
      funcSetInputFlag(false)
      funcSetInput(target.value)
    }
  }

  /**
   * Handles form submission from the login sceen and attempts to login the user.
   * @param e  the form event.
   */
  const handleSubmission = (e: FormEvent<HTMLFormElement>): void => {
    fetch(`${Config.REACT_APP_API_URL}/authenticate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
      })
    })
      .then(async response => {
        if (response.status === 200) {
          navigate('/topics')
        }
      })
      .catch((error) => {
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

                <h2 className=" mt-0 mb-0 text-center">Lesson Settings</h2>
                <br/>
                <MDBValidation className={'row g-3 ' + ((newCardsFlag) ? 'was-validated' : '')}>
                    <MDBValidationItem feedback={newCardsFlag && `Value must be between 1 and ${Config.REACT_APP_MAX_CARDS}.`} invalid={newCardsFlag}>
                        <MDBInput wrapperClass='mb-4 w-100' label='New Words Per Day' id='newWords' min={1} max={Config.REACT_APP_MAX_CARDS} defaultValue={newCards} onChange={ (e) => { validateInput((Number(e.target.value) < 1 || Number(e.target.value) > 100), e.target, setNewCards, setNewCardsFlag) } } type='number' size="lg" required/>
                    </MDBValidationItem>
                </MDBValidation>
                <MDBCheckbox name='flagShowAddedTime' value='' id='flagShowAddedTime' label='Show added time in rememberance buttons' />
                <MDBCheckbox name='flagVaryCardSides' value='' id='flagVaryCardSides' label='Vary target/orign language sides' />
                <br/>
                <MDBBtn size='lg' color="secondary">
                  Reset
                </MDBBtn>
              </MDBCardBody>
            </form>
            <MDBCardBody className='px-5 py-1 w-100 d-flex flex-column'><hr/></MDBCardBody>
            <form onSubmit={handleSubmission}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                <h2 className=" mt-0 mb-0 text-center">Account Settings</h2>
                <br/>
                <MDBValidation className={'row g-3 ' + ((firstNameFlag) ? 'was-validated' : '')}>
                    <MDBValidationItem feedback={firstNameFlag && 'Please enter your first name.'} invalid={firstNameFlag}>
                        <MDBInput wrapperClass='mb-4 w-100' label='First Name' id='firstName' defaultValue={firstName} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setFirstName, setFirstNameFlag) } } type='text' size="lg" required/>
                    </MDBValidationItem>
                </MDBValidation>
                <MDBValidation className={'row g-3 ' + ((lastNameFlag) ? 'was-validated' : '')}>
                    <MDBValidationItem feedback={lastNameFlag && 'Please enter your last name.'} invalid={lastNameFlag}>
                        <MDBInput wrapperClass='mb-4 w-100' label='Last Name' id='lastName' defaultValue={lastName} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setLastName, setLastNameFlag) } } type='text' size="lg" required/>
                    </MDBValidationItem>
                </MDBValidation>
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Send email notificatons for lesson absesnce' />
                <br/>
                <MDBBtn color="secondary" size='lg'>
                  Change Password
                </MDBBtn>
                <hr/>
                <MDBBtn size='lg' outline color="danger">
                  Delete Account
                </MDBBtn>
              </MDBCardBody>
            </form>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  )
}

export default PageLogin
