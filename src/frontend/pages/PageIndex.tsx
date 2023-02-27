import React, { useState, type ReactElement } from 'react'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink
}
  from 'mdb-react-ui-kit'
import { Footer } from '../components/Footer'

function PageIndex (): ReactElement {
  const [currentTab, setCurrentTab] = useState('tabBefore')

  const renderText = (shouldTranslate: boolean): ReactElement => {
    if (!shouldTranslate) {
      return <>Había una vez un <b>perro</b> <b>llamado</b> Max que <b>vivía</b> en una <b>calle</b> con su <b>familia</b>. Un <b>día</b>, Max estaba cerca del <b>río</b> y <b>vio</b> a un <b>pájaro</b> con una <b>herida</b> en su <b>ala</b>. El <b>pájaro</b> no podía <b>volar</b>. Max <b>agarró</b> al <b>pájaro</b> cuidadosamente y lo llevó a su <b>familia</b>. Ellos <b>ayudaron</b> a <b>curar</b> al <b>pájaro</b> y Max y el <b>pájaro</b> se convirtieron en los <b>mejores</b> <b>amigos</b>.</>
    } else {
      return <>Había una vez un <b>dog</b> <b>named</b> Max que <b>lived</b> en una <b>street</b> con su <b>family</b>. Un <b>day</b>, Max estaba cerca del <b>river</b> y <b>saw</b> a un <b>bird</b> con una <b>cut</b> en su <b>wing</b>. El <b>bird</b> no podía <b>fly</b>. Max <b>grabbed</b> al <b>bird</b> cuidadosamente y lo llevó a su <b>family</b>. Ellos <b>helped</b> a <b>heal</b> al <b>bird</b> y Max y el <b>bird</b> se convirtieron en los <b>best</b> <b>friends</b>.</>
    }
  }

  return (

        <><div className="d-flex align-items-start mb-2" style={{ height: '100vh' }}>
          <MDBCol md={7} className="p-5">

              <div className="d-flex">
                  <h3 style={{ fontFamily: '"Bevan", cursive', float: 'left', display: 'inline', alignSelf: 'center' }}>speakeasy.</h3>
                  <div className="d-flex align-items-end flex-row-reverse" style={{ marginLeft: 'auto' }}>
                      <div className="d-flex align-items-center justify-content-center"><MDBBtn color='dark' style={{ paddingTop: '14px', paddingBottom: '14px', paddingLeft: '30px', paddingRight: '30px', margin: '8px' }} href="/login">LOGIN</MDBBtn></div>
                  </div>
              </div>
              <h2 className='py-5 text-center' style={{ fontFamily: "'Pontano Sans', sans-serif", fontWeight: 'bold', background: '-webkit-linear-gradient(94deg, rgb(255 176 176), rgb(255 96 11))', WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', fontSize: '3em' }}> We will teach you the words. You put them together. </h2>
              <p style={{ fontSize: '1.6em', fontFamily: "'Pontano Sans', sans-serif" }}> Speakeasy is reshaping the language learning industry by using technology to reintroduce the original way of learning a language- through memorization and contextual learning. </p>
              <div className="d-grid gap-2"><MDBBtn className='me-1' style={{ fontSize: '1.0em' }} outline href="/register" color='dark'>Create Account</MDBBtn></div>
          </MDBCol>
          <MDBCol className="bg-light" style={{ height: '100vh', overflow: 'scroll' }} md={5}>

              <MDBCard className='p-5 w-100 d-flex flex-column'>
                  <MDBTabs pills fill className='mb-3'>
                      <MDBTabsItem>
                          <MDBTabsLink onClick={(e) => { setCurrentTab('tabBefore') } } active={currentTab === 'tabBefore'}>
                              &lt;
                          </MDBTabsLink>
                      </MDBTabsItem>
                      <MDBTabsItem>
                          <MDBTabsLink onClick={(e) => { setCurrentTab('tabAfter') } } active={currentTab === 'tabAfter'}>
                              &gt;
                          </MDBTabsLink>
                      </MDBTabsItem>
                  </MDBTabs>
                  <MDBCardBody><MDBCardTitle> Español </MDBCardTitle> <p style={{ fontFamily: "'Pontano Sans', sans-serif", fontSize: '1.8em' }}>
                      {renderText(currentTab === 'tabAfter')}
                  </p>  </MDBCardBody></MDBCard>

          </MDBCol>

      </div>
      <Footer/></>
  )
}

export default PageIndex
