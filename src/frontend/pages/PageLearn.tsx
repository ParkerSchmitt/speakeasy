import React, { useEffect, useState, type ReactElement } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Config from '.././Config'
import {
  MDBCard,
  MDBCardBody,
  MDBCardSubTitle,
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
  const [showRememberance, setShowRememberance] = useState(false)

  const toggleFlagReportDialogShow = (): void => { setFlagReportDialog(!flagReportDialog) }

  const navigate = useNavigate()

  /**
     * Saves the memorization effectiveness of the card the user just flipped over.
     * @param learnedScore The score of how well the user did learning
     * @returns A void promise
     */

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    receiveAccountInfo()
  }, [])

  useEffect(() => {
    if (cards.length === 0) {
      receiveCards()
    }
  }, [cards])

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
        setShowRememberance(accountInfo.showAddedTimeInButton)
      }
    }).catch((error) => {
      console.error(error)
    })
  }

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
            imageUrl: Config.REACT_APP_MEDIA_URL + (json.response[i].imageUrl as string),
            audio: new Audio(Config.REACT_APP_MEDIA_URL + (json.response[i].audioUrl as string)),
            buryTime: json.response[i].buryTime
          }
          newCards.push(card)
        }
        setCards(
          cards.concat(newCards)
        )
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
      /// We only want to wait if it is the last card, otherwise receive cards might finish before saveCard and a card would be kept in the learn deck.
      if (cards.length === 1) {
        setFlip(false)
        const tempCard = [...cards]
        tempCard.splice(0, 1)
        setCards(tempCard)
      }
    }).catch((error: Error) => {
      console.log(`Error saving card: Response: ${error.message}`)
    })

    if (cards.length !== 1) {
      setFlip(false)
      const tempCard = [...cards]
      tempCard.splice(0, 1)
      setCards(tempCard)
    }
  }

  const showImageHandler = (): void => {
    setShowImage(!showImage)
  }

  /**
   * renderTimeAddedString takes a time and converts it to a string to render
   * @param time - EPOCH time to convert.
   */
  const renderTimeAddedString = (time: number): string => {
    // > One day
    if ((Math.round((time / 86400000) * 10) / 10) > 1) {
      return `+${Math.round((time / 86400000) * 10) / 10}d`
    // = One day
    } else if ((Math.round((time / 86400000) * 10) / 10) === 1) {
      return `+${Math.round((time / 86400000) * 10) / 10}d`
    } else if ((Math.round((time / 3600000) * 10) / 10) > 1) {
      return `+${Math.round((time / 3600000) * 10) / 10}h`
    } else if ((Math.round((time / 3600000) * 10) / 10) === 1) {
      return `+${Math.round((time / 3600000) * 10) / 10}h`
    } else if ((Math.round((time / 600000) * 10) / 10) > 1) {
      return `+${Math.round((time / 600000) * 10) / 10}h`
    } else if ((Math.round((time / 600000) * 10) / 10) === 1) {
      return `+${Math.round((time / 600000) * 10) / 10}m`
    } else {
      return `+${Math.round((time / 1000) * 10) / 10}s`
    }
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

    if (cards.length > 0) {
      fetch(`${Config.REACT_APP_API_URL}/reportCard`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          topic: 'Spanish',
          cardId: cards[0].id,
          type,
          reason,
          comment
        })
      }).then((response) => {
        if (response.status === 500) {
          navigate('/login')
        }
      }).catch((error: Error) => {
        console.log(`Error saving card: Response: ${error.message}`)
      })
    }
  }

  return (
    <>
        {flagReportDialog && <ReportDialog show={flagReportDialog} submitDialogHandler={submitReportDialogHandler} closeWindowHandler={toggleFlagReportDialogShow}/>}
        <MDBNavbarBrand id='learn-title' className="mx-5 my-2" href='/topics'>speakeasy.</MDBNavbarBrand>
        <MDBContainer className='card-container' fluid style={{}}>
            { /* if user makes it to the end of cards display message */ (cards.length === 0 && !endOfCardsFlag) && <div className="cardl"><MDBSpinner role='status'><span className='visually-hidden'>Loading...</span></MDBSpinner></div>}
            { /* if user makes it to the end of cards display message */ (cards.length === 0 && endOfCardsFlag) && <div className="cardl"><EndFlashcard/></div>}

                { cards.length > 0 &&
                <TransitionGroup>
                    <CSSTransition key={cards[0].id} classNames={{
                      enterActive: 'animatein',
                      exitActive: 'animateout'
                    }} timeout={50}>
                      <div className={`cardl ${flip ? 'flip' : ''}`}>
                        <div className='front' onClick={() => { setFlip(!flip) }}>
                          <FlashCard id={cards[0].id} title='Spanish' text={ cards[0].previewText } flagShowImage={showImage} pronunciation={ cards[0].pronunciation } audio={ (!flip) ? cards[0].audio : undefined } pressShowImageButtonHandler = {showImageHandler} pressReportButtonHandler = {toggleFlagReportDialogShow} />
                        </div>
                        <div className='back' onClick={() => { setFlip(!flip) }}>
                          <FlashCard id={cards[0].id} title='Translation' text={ cards[0].revealText } flagShowImage={showImage} image={(!showImage && flip) ? cards[0].imageUrl : undefined } pressShowImageButtonHandler = {showImageHandler} pressReportButtonHandler = {toggleFlagReportDialogShow} />
                        </div>
                      </div>
                    </CSSTransition>
                </TransitionGroup>
                  }
         </MDBContainer>
         <br/>
         {
            (cards.length > 0 && flip) && <MDBContainer className='px-5' fluid style={{ backgroundColor: '#fff8e3' }}>
            <MDBRow className='options-container' key={cards[0].id}>
               <MDBCol onClick={() => { nextCardHandler(cards[0].id, CardResponse.Mastered) }}>
               <MDBCard shadow='0' border='success' background='white' className='learn-choice p-5 w-100 d-flex flex-column'>
                   <MDBCardBody className='text-success text-center'>
                       <MDBCardTitle>Mastered</MDBCardTitle>
                       {showRememberance && <MDBCardSubTitle>{renderTimeAddedString(cards[0].buryTime[3])}</MDBCardSubTitle>}
                   </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(cards[0].id, CardResponse.Recognized) }}>
                   <MDBCard shadow='0' border='secondary' background='white'className='learn-choice p-5 w-100 d-flex flex-column'>
                       <MDBCardBody className='text-secondary text-center'>
                           <MDBCardTitle>Recognized</MDBCardTitle>
                           {showRememberance && <MDBCardSubTitle>{renderTimeAddedString(cards[0].buryTime[2])}</MDBCardSubTitle>}
                       </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(cards[0].id, CardResponse.Learning) }}>
                   <MDBCard shadow='0' border='warning' background='white' className='learn-choice p-5 w-100 d-flex flex-column'>
                       <MDBCardBody className='text-warning text-center'>
                           <MDBCardTitle>Learning</MDBCardTitle>
                           {showRememberance && <MDBCardSubTitle>{renderTimeAddedString(cards[0].buryTime[1])} & review </MDBCardSubTitle>}
                       </MDBCardBody>
                   </MDBCard>
               </MDBCol>
               <MDBCol onClick={() => { nextCardHandler(cards[0].id, CardResponse.New) }}>
                   <MDBCard shadow='0' border='danger' background='white' className='learn-choice p-5 w-100 d-flex flex-column'>
                   <MDBCardBody className='text-danger text-center'>
                       <MDBCardTitle>New</MDBCardTitle>
                       {showRememberance && <MDBCardSubTitle>{renderTimeAddedString(cards[0].buryTime[0])} & review</MDBCardSubTitle>}
                   </MDBCardBody>
                   </MDBCard>
               </MDBCol>
           </MDBRow>

            </MDBContainer>

         }
          </>
  )
}
