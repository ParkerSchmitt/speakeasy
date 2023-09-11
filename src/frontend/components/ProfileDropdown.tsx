import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon
} from 'mdb-react-ui-kit'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Config from '../Config'

export const ProfileDropdown = (): React.ReactElement => {
  const navigate = useNavigate()

  const handleSignout = (): void => {
    fetch(`${Config.REACT_APP_API_URL}/signout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(async response => {
        if (response.status === 200) {
          navigate('/')
        }
      })
      .catch((error) => {
        throw error
      })
  }

  return (
    <MDBDropdown>
    <MDBDropdownToggle style={{ fontSize: '1.3rem' }} color="tertiary"><MDBIcon fas icon="cog"/></MDBDropdownToggle>
    <MDBDropdownMenu>
      <MDBDropdownItem link href='/account/settings'>Settings</MDBDropdownItem>
      <MDBDropdownItem link>Analytics</MDBDropdownItem>
      <MDBDropdownItem divider/>
      <MDBDropdownItem style={{ padding: '0.5rem 1rem' }}>
        <MDBBtn className='me-1' outline color='danger' style = {{ width: '100%' }} onClick={handleSignout}>Logout</MDBBtn>
    </MDBDropdownItem>
    </MDBDropdownMenu>
  </MDBDropdown>
  )
}
