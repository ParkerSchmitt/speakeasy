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
  MDBInput
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

        <h3 className="my-5 text-center" style={{ fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>

          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <form onSubmit={handleSubmission}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                <h2 className=" mt-0 mb-0 text-center">Sign in</h2>
                <p className="text-white-50 mb-3">Please enter your login and password!</p>

                <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' defaultValue={email} onChange={ (e) => { setEmail(e.target.value) } } type='email' size="lg"/>
                <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' defaultValue={password} onChange={ (e) => { setPassword(e.target.value) } } type='password' size="lg"/>
                <MDBBtn size='lg'>
                  Login
                </MDBBtn>
                <p className="mt-5 text-center">Not a user yet? <a href="/register"> Register!</a> </p>

              </MDBCardBody>
            </form>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  )
}

export default PageLogin
