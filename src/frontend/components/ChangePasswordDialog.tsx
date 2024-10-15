import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBValidation,
  MDBInput,
  MDBValidationItem
} from 'mdb-react-ui-kit'
import React, { useState } from 'react'

export const ChangePasswordDialog = (props: { show: boolean, closeWindowHandler: () => void, submitDialogHandler: () => void }): React.ReactElement => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [currentPasswordFlag, setCurrentPasswordFlag] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordFlag, setNewPasswordFlag] = useState(false)
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [newPasswordRepeatFlag, setNewPasswordRepeatFlag] = useState(false)

  /**
   * Validates the input to see if it is correct, and sets the state of the input
   * @param indicator boolean, if it is valid or not
   * @param target the event target to set the valadility of.
   * @param funcSetInput the value that we are changing the state of
   * @param funcSetInputFlag the flag that corresponds to the input. Used to determine input is modified and if a warning should even be displayed.
   */
  const validateInput = (indicator: boolean, target: HTMLInputElement, funcSetInput: (val: string) => void, funcSetInputFlag: (val: boolean) => void): void => {
    if (indicator) {
      funcSetInput(target.value)
      funcSetInputFlag(true)
    } else {
      funcSetInputFlag(false)
      funcSetInput(target.value)
    }
  }

  return (
      <>
        <MDBModal staticBackdrop tabIndex='-1' show={props.show}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Change password</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={ () => { props.closeWindowHandler() } }></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
              <MDBValidation className={'row g-3 ' + ((currentPassword.length > 0 || currentPasswordFlag) ? 'was-validated' : '') }>
                    <MDBValidationItem feedback={currentPasswordFlag && 'Please enter your current password.'} invalid={ currentPasswordFlag }>
                      <MDBInput wrapperClass='mb-4 w-100' label='Current password' id='currentPassword' defaultValue={currentPassword} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setCurrentPassword, setCurrentPasswordFlag) } } type='password' size="lg" required/>
                    </MDBValidationItem>
                  </MDBValidation>
                  <MDBValidation className={'row g-3 ' + ((newPassword.length > 0 || newPasswordFlag) ? 'was-validated' : '')}>
                    <MDBValidationItem feedback={newPasswordFlag && 'Please choose a new password'} invalid={newPasswordFlag}>
                      <MDBInput wrapperClass='mb-4 w-100' label='New Password' id='newPassword' defaultValue={newPassword} onChange={ (e) => { validateInput((e.target.value.length === 0), e.target, setNewPassword, setNewPasswordFlag) } } type='password' size="lg" pattern={newPassword} required/>
                    </MDBValidationItem>
                  </MDBValidation>
                  <MDBValidation className={'row g-3 ' + ((newPasswordRepeat.length > 0 || newPasswordRepeatFlag) ? 'was-validated' : '')}>
                    <MDBValidationItem feedback={newPasswordRepeatFlag && 'Please make the password match the one above.'} invalid={newPasswordRepeatFlag}>
                      <MDBInput wrapperClass='mb-4 w-100' label='Confirm New Password' id='newPasswordRepeat' defaultValue={newPasswordRepeat} onChange={ (e) => { validateInput((e.target.value !== newPassword), e.target, setNewPasswordRepeat, setNewPasswordRepeatFlag) } } type='password' size="lg" pattern={newPassword} required/>
                    </MDBValidationItem>
                  </MDBValidation>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn size='lg' color="secondary" disabled={ !(currentPassword.length > 0 && newPassword.length > 0 && newPasswordRepeat.length > 0 && newPassword === newPasswordRepeat)} onClick={ () => { props.submitDialogHandler() }}>CHANGE PASSWORD</MDBBtn>
                <MDBBtn size='lg' outline color="secondary" onClick={ () => { props.closeWindowHandler() } }>Cancel</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
  )
}
