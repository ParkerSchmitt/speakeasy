import { MDBCol, MDBContainer, MDBFooter, MDBIcon, MDBRow } from 'mdb-react-ui-kit'
import React from 'react'

export const Footer = (): React.ReactElement => {
  return (

<MDBFooter bgColor='dark' className='text-center text-lg-start text-muted'>
<section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
    <div className='me-5 d-none d-lg-block'>
        <span>Made with <MDBIcon fas icon="heart" /> in Manhattan </span>
    </div>

    <div>
        <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
        </a>
    </div>
</section>

<section className=''>
    <MDBContainer className='text-center text-md-start mt-5'>
        <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>

                <p>
                    <a href='#!' className='text-reset'>
                        Terms of Service
                    </a>
                </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                <p>
                    <a href='#!' className='text-reset'>
                        Privacy Policy
                    </a>
                </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                <p>
                    <a href='#!' className='text-reset'>
                        Research
                    </a>
                </p>
            </MDBCol>
        </MDBRow>
    </MDBContainer>
</section>
</MDBFooter>

  )
}
