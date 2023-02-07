import React from 'react'
import { MDBCard, MDBRow, MDBCol, MDBCardText, MDBCardTitle, MDBCardBody } from 'mdb-react-ui-kit'

export interface Card {
  id: number
  previewText: string
  revealText: string
}

export const FlashCard = (props: { card: Card }): React.ReactElement => {
  return (
    <MDBCard className='p-5 w-100 d-flex flex-column'>
        <MDBRow>
            <MDBCol>
                <MDBCardText>#{props.card.id}</MDBCardText>
            </MDBCol>
            <MDBCol>
                <MDBCardTitle className='text-center'>Spanish</MDBCardTitle>
            </MDBCol>
            <MDBCol></MDBCol>
        </MDBRow>
        <hr/>
        <MDBCardBody>
            <h2 className="my-5 text-center" >{props.card.previewText}</h2>
        </MDBCardBody>
    </MDBCard>
  )
}
