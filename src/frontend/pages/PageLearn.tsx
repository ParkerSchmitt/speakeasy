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
  MDBRow,
  MDBSpinner
} from 'mdb-react-ui-kit'
import { type Card, FlashCard } from '../components/Flashcard'
import { ReportDialog } from '../components/ReportDialog'

import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default function PageTopics (): ReactElement {
  const [cards, setCards] = useState<Card[]>([])
  const [flip, setFlip] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [flagReportDialog, setFlagReportDialog] = useState(false)

  const toggleFlagReportDialogShow = (): void => { setFlagReportDialog(!flagReportDialog) }

  const [currentCards, setCurrentCards] = useState<Card[]>([])

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
        amount: 10
      })
    }).then(async response => await response.json())
      .then(response => {
        const newCards: Card[] = []
        for (let i = 0; i < response.response.length; i++) {
          const card: Card = {
            id: response.response[i].id,
            previewText: response.response[i].previewText,
            revealText: response.response[i].revealText,
            pronunciation: response.response[i].pronunciation,
            imageUrl: 'resources/images/' + (response.response[i].imageUrl as string),
            audio: new Audio('resources/audio/' + (response.response[i].audioUrl as string))
          }
          newCards.push(card)
        }
        setCards(
          cards.concat(newCards)
        )
        setCurrentCards([newCards[0]])
        console.log(cards)
      }).catch((error) => {
        throw error
      })
      .catch((error) => {
        throw error
      })
  }

  enum CardResponse {
    New,
    Learning,
    Recognized,
    Mastered,
  }
  const nextCardHandler = (cardId: number, result: CardResponse): void => {
    // First save the card

    fetch('http://localhost:4000/saveCard', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        topic: 'Spanish',
        quality: result,
        cardId
      })
    }).catch((error: Error) => {
      console.log(`Error saving card: Response: ${error.message}`)
    })

    setFlip(false)
    const tempCard = [...cards]
    tempCard.splice(0, 1)
    setCards(tempCard)
    setCurrentCards([tempCard[0]])

    // If we are at the end of the cards
    if (tempCard.length === 0) {
      receiveCards()
    }
  }

  const showImageHandler = (): void => {
    setShowImage(!showImage)
  }

  return (
    <>

        {flagReportDialog && <ReportDialog show={flagReportDialog} closeWindowHandler={toggleFlagReportDialogShow}/>}

        <MDBNavbarBrand className="m-5" href='#' style={{ color: '#000000', fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='' fluid style={{ paddingLeft: '20em', paddingRight: '20em', backgroundColor: '#fff8e3' }}>
            { cards.length === 0 && <div className="cardl"><MDBSpinner role='status'><span className='visually-hidden'>Loading...</span></MDBSpinner></div>}
                { cards.length > 0 &&
                <TransitionGroup>
                    {currentCards.map((card) =>
                    <CSSTransition key={card.id} classNames={{
                      enterActive: 'animatein',
                      exitActive: 'animateout'
                    }} timeout={50}>
                    <div className={`cardl ${flip ? 'flip' : ''}`}>
                      <div className='front' onClick={() => { setFlip(!flip) }}>
                        <FlashCard id={card.id} title='Spanish' text={ card.previewText } flagShowImage={showImage} pronunciation={ card.pronunciation } audio={ (!flip) ? card.audio : undefined } pressShowImageButtonHandler = {showImageHandler} pressReportButtonHandler = {toggleFlagReportDialogShow} />
                      </div>
                      <div className='back' onClick={() => { setFlip(!flip) }}>
                        <FlashCard id={card.id} title='Translation' text={ card.revealText } flagShowImage={showImage} image={(!showImage && flip) ? card.imageUrl : undefined } pressShowImageButtonHandler = {showImageHandler} pressReportButtonHandler = {toggleFlagReportDialogShow} />
                      </div>
                    </div>
            </CSSTransition>
                    )}
</TransitionGroup>

                  }
         </MDBContainer>
         <br/>
         {
            flip && <MDBContainer className='px-5' fluid style={{ backgroundColor: '#fff8e3' }}>
            { currentCards.map((card) =>

            <MDBRow key={card.id}>
               <MDBCol onClick={() => { nextCardHandler(card.id, CardResponse.Mastered) }}>
               <MDBCard shadow='0' border='success' background='white' className='p-5 w-100 d-flex flex-column'>
                   <MDBCardBody className='text-success text-center'>
                       <MDBCardTitle>Mastered</MDBCardTitle>
                   </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(card.id, CardResponse.Recognized) }}>
                   <MDBCard shadow='0' border='secondary' background='white'className='p-5 w-100 d-flex flex-column'>
                       <MDBCardBody className='text-secondary text-center'>
                           <MDBCardTitle>Recognized</MDBCardTitle>
                       </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(card.id, CardResponse.Learning) }}>
                   <MDBCard shadow='0' border='warning' background='white' className='p-5 w-100 d-flex flex-column'>
                       <MDBCardBody className='text-warning text-center'>
                           <MDBCardTitle>Learning</MDBCardTitle>
                       </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(card.id, CardResponse.New) }}>
                   <MDBCard shadow='0' border='danger' background='white' className='p-5 w-100 d-flex flex-column'>
                   <MDBCardBody className='text-danger text-center'>
                       <MDBCardTitle>New</MDBCardTitle>
                   </MDBCardBody>
                   </MDBCard>
               </MDBCol>
           </MDBRow>
            )}

            </MDBContainer>

         }
          </>
  )
}
