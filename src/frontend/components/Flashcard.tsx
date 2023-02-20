import React from 'react'
import { MDBCard, MDBRow, MDBCol, MDBCardText, MDBCardTitle, MDBCardBody, MDBIcon, MDBCardImage } from 'mdb-react-ui-kit'

export interface Card {
  id: number
  previewText: string
  revealText: string
  imageUrl: string
  pronunciation: string
  audio: HTMLAudioElement
}

export const FlashCard = (props: { id: number, title: string, text: string, pronunciation?: string, audio?: HTMLAudioElement, image?: string, pressShowImageButtonHandler: () => void }): React.ReactElement => {
  return (
    <MDBCard className='w-100 d-flex flex-column'>
    <div className='px-5'>
    <div className="pt-3 d-flex align-items-end flex-row-reverse mb-3">
    <div className="ps-4 py-2"><MDBIcon fas icon='flag' /></div>
    <div className="p-2"><MDBIcon fas icon='microphone' /></div>
    <div className="p-2"><MDBIcon fas icon='image' onClick={(e: Event) => { e.stopPropagation(); props.pressShowImageButtonHandler() } }/></div>
    </div>
        <MDBRow className='pb-3'>
            <MDBCol>
                <MDBCardText>#{props.id}</MDBCardText>
            </MDBCol>
            <MDBCol>
                <MDBCardTitle className='text-center'>{props.title}</MDBCardTitle>
            </MDBCol>
            <MDBCol></MDBCol>
        </MDBRow>
        </div>
        {props.image === undefined &&
        <MDBCardBody>
            <h2 className="my-4 text-center" >{props.text}
              { props.pronunciation !== undefined && <h3 className="text-center" ><i>/{props.pronunciation}/</i>
              {props.audio !== undefined && <div className="p-2"><MDBIcon fas size='xs' icon='volume-up' style={{ fontSize: '0.65em;' }} onClick={(e: Event) => { e.stopPropagation(); e.preventDefault(); props.audio?.play().catch((err) => { console.log(err) }) }}/></div> }</h3> }
            </h2>
        </MDBCardBody>
        }
        {props.image !== undefined && <MDBCardImage position='bottom' src={props.image} alt='...' />}
    </MDBCard>
  )
}
