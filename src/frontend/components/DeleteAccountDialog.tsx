import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from 'mdb-react-ui-kit'
import React from 'react'

export const DeleteAccountDialog = (props: { show: boolean, closeWindowHandler: () => void, submitDialogHandler: () => void }): React.ReactElement => {
  return (
      <>
        <MDBModal staticBackdrop tabIndex='-1' show={props.show}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Delete account?</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={ () => { props.closeWindowHandler() } }></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                  <p>
                    Your account will be <i>permanently</i> deleted with no way to recover progress if you wish to signup again in the future. Are you sure you want to delete your account?
                    <br/>
                    By clicking <b>DELETE ACCOUNT</b> you confirm that you understand the consequences and want to proceed with the account deletion.
                  </p>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn size='lg' color="danger" onClick={ () => { props.submitDialogHandler() }}>DELETE ACCOUNT</MDBBtn>
                <MDBBtn size='lg' outline color="secondary" onClick={ () => { props.closeWindowHandler() } }>NEVERMIND</MDBBtn>

              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
  )
}
