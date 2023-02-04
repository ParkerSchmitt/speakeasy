import React, { type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBCard,
  MDBCardBody,

  MDBCardText,

  MDBCardTitle,

  MDBCol,

  MDBContainer,
  MDBNavbarBrand,
  MDBRow
} from 'mdb-react-ui-kit'

export default function PageTopics (): ReactElement {
  return (
    <>
        <MDBNavbarBrand className="m-5" href='#' style={{ color: '#000000', fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='' fluid style={{ paddingLeft: '20em', paddingRight: '20em', backgroundColor: '#fff8e3' }}>
            <MDBCard className='p-5 w-100 d-flex flex-column'>
                <MDBRow>
                    <MDBCol>
                        <MDBCardText>1/20</MDBCardText>
                    </MDBCol>
                    <MDBCol>
                        <MDBCardTitle className='text-center'>Spanish</MDBCardTitle>
                    </MDBCol>
                    <MDBCol></MDBCol>
                </MDBRow>
                <hr/>
                <MDBCardBody>
                    <h2 className="my-5 text-center" >Casa</h2>
                </MDBCardBody>
            </MDBCard>
         </MDBContainer>
         <br/>
         <MDBContainer className='px-5' fluid style={{ backgroundColor: '#fff8e3' }}>
         <MDBRow>
            <MDBCol>
            <MDBCard shadow='0' border='success' background='white' className='p-5 w-100 d-flex flex-column'>
                <MDBCardBody className='text-success text-center'>
                    <MDBCardTitle>Remembered</MDBCardTitle>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='secondary' background='white'className='p-5 w-100 d-flex flex-column' >
                    <MDBCardBody className='text-secondary text-center'>
                        <MDBCardTitle>Recognized</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='warning' background='white' className='p-5 w-100 d-flex flex-column'>
                    <MDBCardBody className='text-warning text-center'>
                        <MDBCardTitle>Seen</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='danger' background='white' className='p-5 w-100 d-flex flex-column'>
                <MDBCardBody className='text-danger text-center'>
                    <MDBCardTitle>New</MDBCardTitle>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>

         </MDBContainer>
  </>
  )
}
