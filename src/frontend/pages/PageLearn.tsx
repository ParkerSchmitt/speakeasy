import React, { useEffect, useState, type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBNavbarBrand,
  MDBRow
} from 'mdb-react-ui-kit'
import { type Card, FlashCard } from '../components/Flashcard'

export default function PageTopics (): ReactElement {
  const [cards, setCards] = useState<Card[]>([])
  /**
     * Saves the memorization effectiveness of the card the user just flipped over.
     * @param learnedScore The score of how well the user did learning
     * @returns A void promise
     */

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    receiveCards()
  }, [])

  const receiveCards = (): void => {
    fetch('http://localhost:4000/retrieveCards', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        topic: 'Spanish',
        amount: 2
      })
    }).then(async response => await response.json())
      .then(response => {
        const newCards: Card[] = []
        for (let i = 0; i < response.response.length; i++) {
          const card: Card = {
            id: response.response[i].id,
            previewText: response.response[i].targetLanguageWord,
            revealText: response.response[i].nativeLanguageWord
          }
          newCards.push(card)
        }
        setCards(
          cards.concat(newCards)
        )
        console.log(cards)
      }).catch((error) => {
        throw error
      })
      .catch((error) => {
        throw error
      })
  }

  return (
    <>
        <MDBNavbarBrand className="m-5" href='#' style={{ color: '#000000', fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='' fluid style={{ paddingLeft: '20em', paddingRight: '20em', backgroundColor: '#fff8e3' }}>
            {
                cards.length > 0 && <FlashCard card={ cards[0] }/>
            }
         </MDBContainer>
         <br/>
         <MDBContainer className='px-5' fluid style={{ backgroundColor: '#fff8e3' }}>
         <MDBRow>
            <MDBCol>
            <MDBCard shadow='0' border='success' background='white' className='p-5 w-100 d-flex flex-column'>
                <MDBCardBody className='text-success text-center'>
                    <MDBCardTitle>Mastered</MDBCardTitle>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='secondary' background='white'className='p-5 w-100 d-flex flex-column'>
                    <MDBCardBody className='text-secondary text-center'>
                        <MDBCardTitle>Recognized</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='warning' background='white' className='p-5 w-100 d-flex flex-column'>
                    <MDBCardBody className='text-warning text-center'>
                        <MDBCardTitle>Learning</MDBCardTitle>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol>
                <MDBCard shadow='0' border='danger' background='white' className='p-5 w-100 d-flex flex-column'>
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
