import React from 'react'
import { MDBCard, MDBRow, MDBCol, MDBCardText, MDBCardTitle, MDBCardBody } from 'mdb-react-ui-kit'

export interface Card {
  id: number
  previewText: string
  revealText: string
}

export const FlashCard = (props: { id: number, title: string, text: string }): React.ReactElement => {
  return (
    <MDBCard className='p-5 w-100 d-flex flex-column'>
        <MDBRow>
            <MDBCol>
                <MDBCardText>#{props.id}</MDBCardText>
            </MDBCol>
            <MDBCol>
                <MDBCardTitle className='text-center'>{props.title}</MDBCardTitle>
            </MDBCol>
            <MDBCol></MDBCol>
        </MDBRow>
        <hr/>
        <MDBCardBody>
            <h2 className="my-5 text-center" >{props.text}</h2>
        </MDBCardBody>
    </MDBCard>
  )
}
