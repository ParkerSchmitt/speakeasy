import React, { type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBRow
} from 'mdb-react-ui-kit'

export default function PageTopics (): ReactElement {
  return (
    <>
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#' style={{ fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
      </MDBContainer>
    </MDBNavbar>
    <h3 className="mt-5 text-center" style={{ fontFamily: '"Bevan", cursive' }}>select a language.</h3>
    <MDBContainer className='p-5' fluid style={{ backgroundColor: '#fff8e3' }}>
        <MDBCard className='p-5 w-100 d-flex flex-column'>
            <MDBCardBody>
                <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                    <MDBCol>
                        <MDBCard className='h-100'>
                            <MDBCardImage
                                src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/2560px-Flag_of_Italy.svg.png'
                                alt='...'
                                position='top'
                            />
                            <MDBCardBody>
                                <MDBCardTitle>Italian</MDBCardTitle>
                                <MDBCardText>
                                This is a longer card with supporting text below as a natural lead-in to additional content.
                                This content is a little bit longer.
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                        <MDBCol>
            <MDBCard className='h-100'>
            <MDBCardImage
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Simplified_Flag_of_Spain_%28civil_variant%29.svg/1200px-Simplified_Flag_of_Spain_%28civil_variant%29.svg.png'
                alt='...'
                position='top'
            />
            <MDBCardBody>
                <MDBCardTitle>Spanish</MDBCardTitle>
                <MDBCardText>Learn spanish with over 500 vocabulary terms</MDBCardText>
            </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <MDBCol>
            <MDBCard className='h-100'>
            <MDBCardImage
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/800px-Flag_of_France.svg.png'
                alt='...'
                position='top'
            />
            <MDBCardBody>
                <MDBCardTitle>French</MDBCardTitle>
                <MDBCardText>
                Learn french with over 500 vocabulary terms
                </MDBCardText>
            </MDBCardBody>
            </MDBCard>
        </MDBCol>
      <MDBCol>
      <MDBCard className='h-100'>
          <MDBCardImage
            src='https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg'
            alt='...'
            position='top'
          />
          <MDBCardBody>
            <MDBCardTitle>English</MDBCardTitle>
            <MDBCardText>
              This is a longer card with supporting text below as a natural lead-in to additional content.
              This content is a little bit longer.
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    </MDBCardBody>
  </MDBCard>
  </MDBContainer>
  </>
  )
}
