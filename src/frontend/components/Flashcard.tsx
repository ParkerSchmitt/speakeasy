import React from 'react'
import { MDBCard, MDBRow, MDBCol, MDBCardText, MDBCardTitle, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit'

export interface Card {
  id: number
  previewText: string
  revealText: string
}

export const FlashCard = (props: { id: number, title: string, text: string }): React.ReactElement => {
  return (
    <MDBCard className='px-5 w-100 d-flex flex-column'>
    <div className="py-3 d-flex align-items-end flex-row-reverse mb-3">
    <div className="ps-4 py-2"><MDBIcon fas icon='flag' /></div>
    <div className="p-2"><MDBIcon fas icon='volume-up' /></div>
    <div className="p-2"><MDBIcon fas icon='microphone' /></div>
    <div className="p-2"><MDBIcon fas icon='image' /></div>
    </div>
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
