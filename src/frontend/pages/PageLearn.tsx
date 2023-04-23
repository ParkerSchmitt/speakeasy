import React, { useEffect, useState, type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '.././Config'
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
import { EndFlashcard } from '../components/EndFlashcard'

import { ReportDialog } from '../components/ReportDialog'

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useNavigate } from 'react-router'

export default function PageTopics (): ReactElement {
  const [cards, setCards] = useState<Card[]>([])
  const [flip, setFlip] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [flagReportDialog, setFlagReportDialog] = useState(false)
  const [endOfCardsFlag, setEndOfCardsFlag] = useState(false)

  const toggleFlagReportDialogShow = (): void => { setFlagReportDialog(!flagReportDialog) }

  const [currentCards, setCurrentCards] = useState<Card[]>([])
  const navigate = useNavigate()

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
    fetch(`${Config.REACT_APP_API_URL}/retrieveCards`, {
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
    }).then(async (response) => {
      if (response.status === 500) {
        navigate('/login')
      }

      const json = await response.json()
      const newCards: Card[] = []

      if (json.response.length === 0) {
        setEndOfCardsFlag(true)
      } else {
        for (let i = 0; i < json.response.length; i++) {
          const card: Card = {
            id: json.response[i].id,
            previewText: json.response[i].previewText,
            revealText: json.response[i].revealText,
            pronunciation: json.response[i].pronunciation,
            imageUrl: Config.REACT_APP_MEDIA_URL + '/resources/images/' + (json.response[i].imageUrl as string),
            audio: new Audio(Config.REACT_APP_MEDIA_URL + '/resources/audio/' + (json.response[i].audioUrl as string))
          }
          newCards.push(card)
        }
        setCards(
          cards.concat(newCards)
        )
        setCurrentCards([newCards[0]])
        console.log(cards)
      }
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

    fetch(`${Config.REACT_APP_API_URL}/saveCard`, {
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
    }).then((response) => {
      if (response.status === 500) {
        navigate('/login')
      }
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

  /**
   * Called when a user tries to report a card
   * @param type type type of report - image, reveal, preview, pronunciation
   * @param reason the reason for the report  - offensive, incorrect, improvement
   * @returns void proomise
   * @param comment additonal comment for the report
   */
  const submitReportDialogHandler = (type: string, reason: string, comment: string): void => {
    toggleFlagReportDialogShow()

    fetch(`${Config.REACT_APP_API_URL}/reportCard`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        topic: 'Spanish',
        cardId: currentCards[0].id,
        type: type,
        reason: reason,
        comment: comment
      })
    }).then((response) => {
      if (response.status === 500) {
        navigate('/login')
      }
    }).catch((error: Error) => {
      console.log(`Error saving card: Response: ${error.message}`)
    })
  }

  return (
    <>

        {flagReportDialog && <ReportDialog show={flagReportDialog} submitDialogHandler={submitReportDialogHandler} closeWindowHandler={toggleFlagReportDialogShow}/>}

        <MDBNavbarBrand className="m-5" href='#' style={{ color: '#000000', fontFamily: '"Bevan", cursive' }}>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='' fluid style={{ paddingLeft: '20em', paddingRight: '20em', backgroundColor: '#fff8e3' }}>
            { /* if user makes it to the end of cards display message */ (cards.length === 0 && !endOfCardsFlag) && <div className="cardl"><MDBSpinner role='status'><span className='visually-hidden'>Loading...</span></MDBSpinner></div>}
            { /* if user makes it to the end of cards display message */ (cards.length === 0 && endOfCardsFlag) && <div className="cardl"><EndFlashcard/></div>}

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
