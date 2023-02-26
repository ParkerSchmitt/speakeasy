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

export const FlashCard = (props: { id: number, title: string, text: string, pronunciation?: string, audio?: HTMLAudioElement, flagShowImage: boolean, image?: string, pressShowImageButtonHandler: () => void, pressReportButtonHandler: () => void }): React.ReactElement => {
  return (
    <MDBCard className='w-100 d-flex flex-column'>
    <div className='px-5'>
    <div className="pt-3 d-flex align-items-end flex-row-reverse mb-3">
    <div className="ps-2 "><div className="p-2 d-flex align-items-center justify-content-center eventButton" onClick={(e: any) => { e.stopPropagation(); props.pressReportButtonHandler() } }><MDBIcon fas icon='flag'/></div></div>
    <div className="p-2 d-flex align-items-center justify-content-center eventButton"><MDBIcon fas icon='microphone'/></div>
    <div className={`p-2 d-flex align-items-center justify-content-center eventButton ${(props.flagShowImage) ? '' : 'eventButtonActive'}`} onClick={(e: any) => { e.stopPropagation(); props.pressShowImageButtonHandler() } } ><MDBIcon fas icon='image'/></div>
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
              {props.audio !== undefined && <div><MDBIcon fas size='xs' icon='volume-up' style={{ fontSize: '0.65em;' }} onClick={(e: Event) => { e.stopPropagation(); e.preventDefault(); props.audio?.play().catch((err) => { console.log(err) }) }}/></div> }</h3> }
            </h2>
        </MDBCardBody>
        }
        {props.image !== undefined && <MDBCardImage position='bottom' src={props.image} alt='...' />}
    </MDBCard>
  )
}
