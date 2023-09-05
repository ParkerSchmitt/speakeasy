/* eslint-disable @typescript-eslint/quotes */
import React, { type ReactElement, useState, useEffect } from 'react'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBIcon
}
  from 'mdb-react-ui-kit'
import { ToastContainer, toast } from 'react-toastify'
import Config from '../Config'
import { useNavigate, useParams } from 'react-router-dom'

function PageVerifyAccount (): ReactElement {
  const [isVerified, setIsVerified] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (token === undefined) {
      toast.error("Missing token", {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
        theme: 'colored',
        icon: <MDBIcon fas icon="times" />
      })
    } else {
      fetch(`${Config.REACT_APP_API_URL}/account/verify/${token}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then(async response => {
          if (response.status === 200) {
            setIsVerified(true)
            const timer = setTimeout(() => {
              navigate('/topics')
            }, 1000) // Navigate after one second
            clearTimeout(timer)
          } else {
            toast.error("Error verifying email", {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
              theme: 'colored',
              icon: <MDBIcon fas icon="times" />
            })
          }
        }).catch((error) => {
          throw error
        })
    }
  })

  return (
    <MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>
      <ToastContainer />
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <h3 className="my-5 text-center" style={{ color: '#3B71CA', fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>
              {
                isVerified
                  ? <MDBIcon fas icon="check" style= {{ fontSize: "3em", textAlign: "center", color: "#3b71ca" }}/>
                  : <MDBSpinner color='primary' style= {{ textAlign: "center", margin: "auto", color: "#3b71ca" }}>
                  <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
              }
                <h2 style={{ textAlign: "center", marginTop: "0.5rem", marginBottom: "0.5rem" }}> { isVerified ? 'Verified Email' : 'Verifying Email' } </h2>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default PageVerifyAccount
