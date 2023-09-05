/* eslint-disable @typescript-eslint/quotes */
import React, { type ReactElement, type FormEvent, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '../Config'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon
}
  from 'mdb-react-ui-kit'

function PageVerifyAccount (): ReactElement {
  const [isResendEnabledState, setIsResendEnabledState] = useState(true)

  /**
   * Handles form submission from the resend button and attempts to rsend an email.
   * @param e  the form event.
   */
  const handleResendSubmission = (e: FormEvent<HTMLButtonElement>): void => {
    fetch(`${Config.REACT_APP_API_URL}/account/verify/resend`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(async response => {
        if (response.status === 200) {
          toast.success("Resent verification email", {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            theme: 'colored',
            icon: <MDBIcon fas icon="check" />
          })
          setIsResendEnabledState(false)
          const timer = setTimeout(() => {
            setIsResendEnabledState(true)
          }, 1000 * 60 * 5) // Enable after five minutes
          clearTimeout(timer)
        } else {
          toast.error("Error resending email", {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            theme: 'colored',
            icon: <MDBIcon fas icon="times" />
          })
        }
      }).catch((error) => {
        throw error
      })
    e.preventDefault()
  }

  return (
    <MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>
      <ToastContainer />
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <h3 className="my-5 text-center" style={{ color: '#3B71CA', fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>
                <MDBIcon fas icon="envelope-square" style= {{ fontSize: "3em", textAlign: "center", color: "#3b71ca" }}/>
                <h2 style={{ textAlign: "center", marginTop: "0.5rem" }}>Verify Email</h2>
                <p>Pleases verify your email address by clicking the link in the email.</p>
                <button disabled={!isResendEnabledState} type="button" className="btn btn-secondary" onClick={(e) => {
                  handleResendSubmission(e)
                } }>Resend</button>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  )
}

export default PageVerifyAccount
