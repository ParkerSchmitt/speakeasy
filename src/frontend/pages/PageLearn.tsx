import React, { type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBCard,
  MDBCardBody,

  MDBCardText,

  MDBCardTitle,

  MDBCol,

  MDBContainer,
  MDBNavbarBrand,
  MDBRow
} from 'mdb-react-ui-kit'




export default function PageTopics (): ReactElement {

    /**
     * Saves the memorization effectiveness of the card the user just flipped over.
     * @param learnedScore The score of how well the user did learning
     * @returns A void promise
     */
    const feedbackHook = (learnedScore: number): Promise<void> => {
        try {
            fetch('http://localhost:4000/saveCard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                learnedScore: learnInt
                cardNum: this.state.cardNum,
                topic: this.prop.topic
            })
        })      .then(async response => {
            if (response.status === 200) {
              navigate('/topics')
            }
          })
          .catch((error) => {
            throw error
          })
        } catch (err: error) {
            throw err
        }

        const receiveCards = (learnedScore: number): Promise<void> => {
            try {
                fetch('http://localhost:4000/receiveCards', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    learnedScore: learnInt
                    cardNum: this.state.cardNum,
                    topic: this.prop.topic
                })
            })      .then(async response => {
                if (response.status === 200) {
                  navigate('/topics')
                }
              })
              .catch((error) => {
                throw error
              })
            } catch (err: error) {
                throw err
            }

    } 


    return (
    <>
        <MDBNavbarBrand className="m-5" href='#' style={{ color: '#000000', fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='' fluid style={{ paddingLeft: '20em', paddingRight: '20em', backgroundColor: '#fff8e3' }}>
            <MDBCard className='p-5 w-100 d-flex flex-column'>
                <MDBRow>
                    <MDBCol>
                        <MDBCardText>1/20</MDBCardText>
                    </MDBCol>
                    <MDBCol>
                        <MDBCardTitle className='text-center'>Spanish</MDBCardTitle>
                    </MDBCol>
                    <MDBCol></MDBCol>
                </MDBRow>
                <hr/>
                <MDBCardBody>
                    <h2 className="my-5 text-center" >Casa</h2>
                </MDBCardBody>
            </MDBCard>
         </MDBContainer>
         <br/>
         <MDBContainer className='px-5' fluid style={{ backgroundColor: '#fff8e3' }}>
         <MDBRow>
            <MDBCol>
            <MDBCard shadow='0' border='success' background='white' className='p-5 w-100 d-flex flex-column' onClick={() => {feedbackHook(4)}}>
                <MDBCardBody className='text-success text-center'>
                    <MDBCardTitle>Mastered</MDBCardTitle>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='secondary' background='white'className='p-5 w-100 d-flex flex-column' onClick={() => {feedbackHook(3)}}>
                    <MDBCardBody className='text-secondary text-center'>
                        <MDBCardTitle>Recognized</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='warning' background='white' className='p-5 w-100 d-flex flex-column' onClick={() => {feedbackHook(2)}}>
                    <MDBCardBody className='text-warning text-center'>
                        <MDBCardTitle>Learning</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='danger' background='white' className='p-5 w-100 d-flex flex-column' onClick={() => {feedbackHook(1)}}>
                <MDBCardBody className='text-danger text-center'>
                    <MDBCardTitle>New</MDBCardTitle>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>

         </MDBContainer>
  </>
  )
}
