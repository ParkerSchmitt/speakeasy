import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRadio,
  MDBTextArea
} from 'mdb-react-ui-kit'
import React, { useState } from 'react'

export const ReportDialog = (props: { show: boolean, closeWindowHandler: () => void, submitDialogHandler: (type: string, reason: string, comment: string) => void }): React.ReactElement => {
  const [type, setType] = useState('image')
  const [reason, setReason] = useState('incorrect')
  const [comment, setComment] = useState('')

  return (
    <>
      <MDBModal staticBackdrop tabIndex='-1' show={props.show}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Report Card</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={ () => { props.closeWindowHandler() } }></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <h5> Type </h5>
                <MDBRadio name='typeChoice' value='image' onChange={ (e) => { setType(e.target.value) }} id='radioTypeChoiceImage' label='Image' defaultChecked/>
                <MDBRadio name='typeChoice' value='preview' onChange={ (e) => { setType(e.target.value) }} id='radioTypeChoicePreview' label='Preview Text'/>
                <MDBRadio name='typeChoice' value='reveal' onChange={ (e) => { setType(e.target.value) }} id='radioTypeChoiceReveal' label='Reveal Text' />
                <MDBRadio name='typeChoice' value='pronunciation' onChange={ (e) => { setType(e.target.value) }} id='radioTypeChoicePronunciation' label='Pronunciation' />
                <h5> Report for </h5>
                <MDBRadio name='offenseChoice' value='offensive' onChange={ (e) => { setReason(e.target.value) }} id='radioOffenseChoiceImage' label='Offensive' />
                <MDBRadio name='offenseChoice' value='incorrect' onChange={ (e) => { setReason(e.target.value) }} id='radioOffenseChoicePreview' label='Incorrect' defaultChecked />
                <MDBRadio name='offenseChoice' value='improvement' onChange={ (e) => { setReason(e.target.value) }} id='radioOffenseChoicePreview' label='Improvement'/>
                <h5> Additional Comments </h5>
                <MDBTextArea name="comments" id="comments" onChange={ (e) => { setComment(e.target.value) }}>
                </MDBTextArea>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn disabled={!(type.length > 0 && reason.length > 0)} onClick={ () => { props.submitDialogHandler(type, reason, comment) }}>Submit</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  )
}
