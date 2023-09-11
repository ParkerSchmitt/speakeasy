import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon
} from 'mdb-react-ui-kit'
import React from 'react'

export const ProfileDropdown = (): React.ReactElement => {
  return (
    <MDBDropdown>
    <MDBDropdownToggle style={{ fontSize: '1.3rem' }} color="tertiary"><MDBIcon fas icon="cog"/></MDBDropdownToggle>
    <MDBDropdownMenu>
      <MDBDropdownItem link href='/account/settings'>Settings</MDBDropdownItem>
      <MDBDropdownItem link>Analytics</MDBDropdownItem>
      <MDBDropdownItem divider/>
      <MDBDropdownItem style={{ padding: '0.5rem 1rem' }}>
        <MDBBtn className='me-1' outline color='danger' style = {{ width: '100%' }}>Logout</MDBBtn>
    </MDBDropdownItem>
    </MDBDropdownMenu>
  </MDBDropdown>
  )
}
