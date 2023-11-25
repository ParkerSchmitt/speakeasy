import React, { useState, type ReactElement, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '.././Config'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBValidation,
  MDBValidationItem,
  MDBIcon
}
  from 'mdb-react-ui-kit'
import { ToastContainer, toast } from 'react-toastify'

function PageLogin (): ReactElement {
  const [firstName, setFirstName] = useState('')
  const [firstNameFlag, setFirstNameFlag] = useState(false)
  const [lastName, setLastName] = useState('')
  const [lastNameFlag, setLastNameFlag] = useState(false)
  const [newCardsFlag, setNewCardsFlag] = useState(false)
  const [newCards, setNewCards] = useState('')
  const [showRememberance, setShowRememberance] = useState(false)
  const [sendEmailReminder, setSendEmailReminder] = useState(false)
  const updateValues = useRef<Record<string, any>>({})

  const navigate = useNavigate()

  /**
   * Load up the account info on page load
   */
  useEffect(() => {
    receiveAccountInfo()
  }, [])

  /**
   * Save after X seconds
   */
  useEffect(() => {
    const updateDebounce = setTimeout(() => {
      if (Object.keys(updateValues.current).length !== 0) {
        saveAccountInfo(updateValues.current)
      }
    }, Config.REACT_APP_SETTING_DEBOUNCE_MILLIS)
    return () => { clearTimeout(updateDebounce) }
  }, [firstName, lastName, newCards, showRememberance, sendEmailReminder])

  const receiveAccountInfo = (): void => {
    fetch(`${Config.REACT_APP_API_URL}/account/info`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(async (response) => {
      if (response.status === 401) {
        navigate('/login')
      } else {
        const accountInfo = (await response.json()).response
        setFirstName(accountInfo.firstName)
        setLastName(accountInfo.lastName)
        setNewCards(accountInfo.wordsPerDay)
        setShowRememberance(accountInfo.showAddedTimeInButton)
        setSendEmailReminder(accountInfo.sendEmailLessonAbsesnce)
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  const saveAccountInfo = (items: Record<string, any>): void => {
    if (Object.keys(items).length !== 0) {
      fetch(`${Config.REACT_APP_API_URL}/account/info`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(items),
        credentials: 'include'
      }).then(async (response) => {
        updateValues.current = {}
        if (response.status === 401) {
          navigate('/login')
        } else if (response.status === 400) {
          toast.error('Error saving preference', {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            theme: 'colored',
            icon: <MDBIcon fas icon="times" />
          })
        } else {
          toast.success('Successfuly saved preference', {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            theme: 'colored',
            icon: <MDBIcon fas icon="check" />
          })
        }
      }).catch((error) => {
        console.error(error)
        toast.error('Error saving preference', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          theme: 'colored',
          icon: <MDBIcon fas icon="times" />
        })
      })
    }
  }

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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete updateValues.current[target.id]
    } else {
      funcSetInputFlag(false)
      funcSetInput(target.value)
      updateValues.current[target.id] = target.value
      switch (target.type) {
        case 'number':
          updateValues.current[target.id] = Number(target.value)
          break
        case 'text':
          updateValues.current[target.id] = String(target.value)
          break
      }
    }
  }

  return (
    <MDBContainer fluid style={{ backgroundColor: '#fff8e3' }}>
      <ToastContainer />
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <h3 className="my-5 text-center" style={{ color: '#3B71CA', fontFamily: '"Bevan", cursive' }}>speakeasy.</h3>

          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className=" mt-0 mb-0 text-center">Lesson Settings</h2>
              <br />
              <MDBValidation className={'row g-3 ' + ((newCardsFlag) ? 'was-validated' : '')}>
                <MDBValidationItem feedback={newCardsFlag && `Value must be between 1 and ${Config.REACT_APP_MAX_CARDS}.`} invalid={newCardsFlag}>
                  <MDBInput wrapperClass='mb-4 w-100' label='New Words Per Day' id='wordsPerDay' min={1} max={Config.REACT_APP_MAX_CARDS} value={newCards} onChange={(e) => { validateInput((Number(e.target.value) < 1 || Number(e.target.value) > Config.REACT_APP_MAX_CARDS), e.target, setNewCards, setNewCardsFlag) }} type='number' size="lg" required />
                </MDBValidationItem>
              </MDBValidation>
              <MDBCheckbox name='flagShowAddedTime' checked={showRememberance} id='flagShowAddedTime' label='Show added time in rememberance buttons' />
              <br />
              <MDBBtn size='lg' color="secondary" disabled={(Number(newCards) === Config.REACT_APP_DEFAULT_CARDS)} onClick={() => {
                setNewCards(String(Config.REACT_APP_DEFAULT_CARDS))
                // eslint-disable-next-line quote-props
                saveAccountInfo({ 'wordsPerDay': Number(Config.REACT_APP_DEFAULT_CARDS) })
              }}>
                Reset
              </MDBBtn>
            </MDBCardBody>
            <MDBCardBody className='px-5 py-1 w-100 d-flex flex-column'><hr /></MDBCardBody>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className=" mt-0 mb-0 text-center">Account Settings</h2>
              <br />
              <MDBValidation className={'row g-3 ' + ((firstNameFlag) ? 'was-validated' : '')}>
                <MDBValidationItem feedback={firstNameFlag && 'Please enter your first name.'} invalid={firstNameFlag}>
                  <MDBInput wrapperClass='mb-4 w-100' label='First Name' id='firstName' value={firstName} onChange={(e) => { validateInput((e.target.value.length === 0), e.target, setFirstName, setFirstNameFlag) }} type='text' size="lg" required />
                </MDBValidationItem>
              </MDBValidation>
              <MDBValidation className={'row g-3 ' + ((lastNameFlag) ? 'was-validated' : '')}>
                <MDBValidationItem feedback={lastNameFlag && 'Please enter your last name.'} invalid={lastNameFlag}>
                  <MDBInput wrapperClass='mb-4 w-100' label='Last Name' id='lastName' value={lastName} onChange={(e) => { validateInput((e.target.value.length === 0), e.target, setLastName, setLastNameFlag) }} type='text' size="lg" required />
                </MDBValidationItem>
              </MDBValidation>
              <MDBCheckbox name='flexCheck' checked={sendEmailReminder} id='flexCheckDefault' label='Send email notificatons for lesson absesnce' />
              <br />
              <MDBBtn color="secondary" size='lg'>
                Change Password
              </MDBBtn>
              <hr />
              <MDBBtn size='lg' outline color="danger">
                Delete Account
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  )
}

export default PageLogin
