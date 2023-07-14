import React, { useEffect, useState, type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '.././Config'
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardTitle,
  MDBCol,
  MDBRow,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink
}
  from 'mdb-react-ui-kit'
import { useNavigate } from 'react-router'

function PageLogin (): ReactElement {
  const topicName = 'Spanish'
  const [percentage, setPercentage] = useState<number | null >(null)
  const [practiceCards, setPracticeCards] = useState<any[] | null >(null)

  const navigate = useNavigate()

  /**
     * Saves the memorization effectiveness of the card the user just flipped over.
     * @param learnedScore The score of how well the user did learning
     * @returns A void promise
     */

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    receiveTopicPercentage()
    receiveTopicPracticeCards()
  }, [])

  const receiveTopicPercentage = (): void => {
    fetch(`${Config.REACT_APP_API_URL}/topics/${topicName}/percentage`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(async (response) => {
      if (response.status === 500) {
        navigate('/login')
      } else {
        const json = await response.json()
        setPercentage(Math.floor(json.response.percentageLearned * 100)) // Turn it into a whole number percentage to look nice
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const receiveTopicPracticeCards = (): void => {
    fetch(`${Config.REACT_APP_API_URL}/topics/${topicName}/practice`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(async (response) => {
      if (response.status === 500) {
        navigate('/login')
      } else {
        const json = await response.json()
        setPracticeCards(json.response)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <><div className="align-items-start mb-2">
        <div className="d-flex">
        <MDBCol id="topics-header" md={4} className="p-5">
          <h3>speakeasy.</h3>
        </MDBCol>
        <MDBCol md={8} id="topic-selection-nav" className="p-5">
            <div className="d-flex align-items-end" style={{ marginLeft: 'auto' }}>
              <div className="d-flex align-items-center justify-content-center">
                <MDBTabs justify className='mb-3 pl-5'>
                <MDBTabsItem>
                  <MDBTabsLink active={true} className="bg-transparent" style={{ backgroundColor: 'none !important' }} >
                  español
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink active={false} className="bg-transparent">
                  français
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>
            </div>
          </div>
        </MDBCol>
      </div>
    </div>
    <div className="align-items-start mb-2">
        <div className="d-flex">
        <MDBCol md={4}>
        <MDBCard background='primary' className='sidebar-nav text-white'>
        <MDBCardHeader class="text-center" style={{ marginTop: '10rem' }}>
          <MDBCardTitle style={{ fontSize: '5rem' }}>
            {percentage === null && <p className="placeholder-glow"><span className='placeholder w-25 placeholder-xs'></span>%</p>}
            {percentage !== null && <p>{percentage}%</p>}
          </MDBCardTitle>
          <MDBCardTitle style={{ fontSize: '2rem' }}>complete with course</MDBCardTitle>
          </MDBCardHeader>
          <MDBCardBody>
          <div className="d-grid gap-2" style={{ zIndex: '1' }}><MDBBtn className='me-1' style={{ fontSize: '1.5em' }} href="/learn" color='secondary'>RESUME</MDBBtn></div>
    </MDBCardBody>
      </MDBCard>
        </MDBCol>
        <MDBCol md={8} id="topics-previously-learned" className="p-5">
          <h2>Previously learned</h2>
          <hr/>
        <MDBRow>
          {practiceCards?.map(item => (
           <MDBCol key={item.previewText} xl={6} className='mb-4'>
            <MDBCard>
              <MDBCardBody>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <img
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions
                      src={Config.REACT_APP_MEDIA_URL + `${item.imageUrl!}`}
                      alt=''
                      style={{ width: '45px', height: '45px' }}
                      className='rounded-circle'
                    />
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>{item.previewText}</p>
                    <p className='text-muted mb-0'>{item.revealText}</p>
                  </div>
                </div>
              <MDBBadge pill color='primary' light>
              /{item.pronunciation}/
              </MDBBadge>
            </div>
          </MDBCardBody>
        </MDBCard>
          </MDBCol>
          ))
        }
        </MDBRow>
        </MDBCol>
      </div>
    </div>
    </>
  )
}

export default PageLogin
