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
import React from 'react'

export const ReportDialog = (props: { show: boolean, closeWindowHandler: () => void }): React.ReactElement => {
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
                <MDBRadio name='typeChoice' id='radioTypeChoiceImage' label='Image' defaultChecked/>
                <MDBRadio name='typeChoice' id='radioTypeChoicePreview' label='Preview Text'/>
                <MDBRadio name='typeChoice' id='radioTypeChoiceReveal' label='Reveal Text' />
                <MDBRadio name='typeChoice' id='radioTypeChoicePronunciation' label='Pronunciation' />
                <h5> Report for </h5>
                <MDBRadio name='offenseChoice' id='radioOffenseChoiceImage' label='Offensive' />
                <MDBRadio name='offenseChoice' id='radioOffenseChoicePreview' label='Incorrect' defaultChecked />
                <MDBRadio name='offenseChoice' id='radioOffenseChoicePreview' label='Improvement'/>
                <h5> Additional Comments </h5>
                <MDBTextArea name="comments" id="comments">
                </MDBTextArea>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn>Submit</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  )
}
