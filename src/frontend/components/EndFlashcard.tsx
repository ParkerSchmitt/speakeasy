import React from 'react'
import { MDBCard, MDBRow, MDBCol, MDBCardTitle, MDBCardImage } from 'mdb-react-ui-kit'

export const EndFlashcard = (): React.ReactElement => {
  return (
    <MDBCard className='w-100 d-flex flex-column'>
          <div className='px-5'>
          <MDBRow className='pb-3'>
              <MDBCol>
              </MDBCol>
              <MDBCol>
                  <MDBCardTitle className='text-center'>You have reached the end of this session!</MDBCardTitle>
              </MDBCol>
              <MDBCol></MDBCol>
          </MDBRow>
      </div><MDBCardImage position='bottom' src={'../resources/images/speakeasycat.png'} alt='Cat wearing graduation gown.' />
    </MDBCard>
  )
}
