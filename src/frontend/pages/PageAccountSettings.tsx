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
  MDBCheckbox
}
  from 'mdb-react-ui-kit'

function PageLogin (): ReactElement {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

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
        email,
        password
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
                <MDBInput wrapperClass='mb-4 w-100' label='New Words Per Day' id='newWords' min={1} max={Config.REACT_APP_MAX_CARDS} defaultValue={10} onChange={ (e) => { setEmail(e.target.value) } } type='number' size="lg"/>
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
                <MDBInput wrapperClass='mb-4 w-100' label='First Name' id='formControlLg' defaultValue={email} onChange={ (e) => { setEmail(e.target.value) } } type='text' size="lg"/>
                <MDBInput wrapperClass='mb-4 w-100' label='Last Name' id='formControlLg' defaultValue={password} onChange={ (e) => { setPassword(e.target.value) } } type='text' size="lg"/>
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
