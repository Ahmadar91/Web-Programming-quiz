
/*
variables
*/

const inputText = document.createElement('input')
//
const pQuestions = document.createElement('p')
const pTimer = document.createElement('p')
const spanTimer = document.createElement('span')
const spanQuestion = document.createElement('span')
spanQuestion.setAttribute('id', 'question')
spanTimer.setAttribute('id', 'timer')
pTimer.appendChild(spanTimer)
pQuestions.appendChild(spanQuestion)
const body = document.querySelector('body')
// const questionSpan = document.querySelector('#question')
const radioQuestion = document.createElement('input')
const form = document.querySelector('#form')
radioQuestion.setAttribute('type', 'radio')
let alt
let br
let radioArray
let label
radioQuestion.setAttribute('name', 'alt')
let nextURL = ''
let newData = {

}
// const timer = document.querySelector('#timer')
let timeLeft = 20
let timerId
const playerNames = []
const gameOver = document.createElement('p')
gameOver.textContent = 'Game Over'
const scoreBoard = document.createElement('div')
scoreBoard.setAttribute('id', '#scoreBoard')
const orderList = document.createElement('ol')
scoreBoard.setAttribute('id', '#ol')
/*
fetch the question to the the server
*/
async function getQuestion (id) {
  await fetch(`http://vhost3.lnu.se:20080/question/${id}`, { mode: 'cors' })
    .then(
      function (res) {
        if (res.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
           res.status)
          return
        }
        // Examine the text in the response
        res.json().then(function (data) {
          console.log(data)

          // questionSpan.textContent = data.question
          spanQuestion.textContent = data.question
          nextURL = data.nextURL

          newData = data

          if (typeof (newData.alternatives) !== 'undefined') {
            altQuestions()
          } else {
            textQuestions()
          }
          return data
        })
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}

/*
post the question to the the server
*/
async function postData (url, data = {}) {
  await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(el => el.json()).then(data => {
    const str = data.nextURL
    if (str == null) {
      endGame()
      return
    }
    const res = str.slice(36, str.length)
    console.log(data)
    console.log('TCL: postData -> res', res)
    getQuestion(res)
  }).catch(function (err) {
    // endGame()
    console.log('Fetch Error :-S', err)
  })
}
function altQuestions () {
  countdown()
  radioArray = Object.values(newData.alternatives)
  for (let index = 0; index < radioArray.length; index++) {
    br = document.createElement('br')
    alt = document.createElement('input')
    label = document.createElement('label')
    alt.setAttribute('type', 'radio')
    alt.setAttribute('name', 'alt')
    alt.setAttribute('id', 'alt' + [index + 1])
    alt.setAttribute('value', '' + radioArray[index])
    alt.textContent = radioArray[index]
    label.setAttribute('for', 'alt' + [index + 1])
    label.textContent = radioArray[index]
    form.appendChild(alt)
    form.append(label)
    form.appendChild(br)
  }
  const altResult = {
    answer: ''
  }
  const selectLabel = document.querySelectorAll('#form label')
  const selectAlt = document.querySelectorAll('#form input[type=radio]')
  const buttonAlt = document.createElement('button')
  buttonAlt.classList.add('button')
  buttonAlt.textContent = 'submit'
  form.appendChild(buttonAlt)
  for (let i = 0; i < selectLabel.length; i++) {
    selectLabel[i].addEventListener('mouseover', () => {
      selectLabel[i].classList.add('greenColor')
    })
    selectLabel[i].addEventListener('mouseout', () => {
      selectLabel[i].classList.remove('greenColor')
    })

    selectAlt[i].addEventListener('click', () => {
      altResult.answer = selectAlt[i].getAttribute('id')
      console.log('TCL: altQuestions -> altResult.answer', altResult.answer)
      // TODO:fix the post error from here
      buttonAlt.addEventListener('click', e => {
        postData(nextURL, altResult)
        removeInput()
        timeLeft = 20
      })
    })
  }
}

function removeInput () {
  while (form.hasChildNodes()) {
    form.removeChild(form.lastChild)
  }
}
let buttonText
let br1
function textQuestions () {
  countdown()
  inputText.setAttribute('type', 'text')
  form.appendChild(inputText)
  buttonText = document.createElement('button')
  br1 = document.createElement('br')
  buttonText.textContent = 'submit'
  buttonText.classList.add('button')
  form.appendChild(br1)
  form.appendChild(buttonText)
  buttonText.addEventListener('click', e => {
    const result = {
      answer: ''
    }
    result.answer = inputText.value
    postData(nextURL, result)
    e.preventDefault()
    form.removeChild(inputText)
    timeLeft = 20
    form.removeChild(buttonText)
    form.removeChild(br1)
  })
}
function endGame () {
  removeInput()

  console.log('Congrats you won')
  let players
  gameOver.classList.add('red')
  body.appendChild(gameOver)
  clearTimeout(timerId)
  body.removeChild(pQuestions)
  body.removeChild(pTimer)

  for (let i = 0; i < 5; i++) {
    players = document.createElement('li')
    players.textContent = '' + playerNames[i]
    orderList.appendChild(players)
  }
  scoreBoard.appendChild(orderList)
  body.appendChild(scoreBoard)
  reset()
}

function countdown () {
  if (timeLeft === -1) {
    clearTimeout(timerId)
    doSomething()
  } else {
    spanTimer.innerHTML = timeLeft + ' seconds remaining'
    timeLeft--
  }
  if (timeLeft < 10) {
    spanTimer.classList.add('red')
  }
  if (timeLeft > 10) {
    spanTimer.classList.remove('red')
  }
}

function doSomething () {
  endGame()
}

export function StartGame () {
  const message = document.createElement('H3')
  message.textContent = 'Enter you name to start'
  const start = document.createElement('button')
  start.classList.add('button')
  start.textContent = 'submit'
  const br = document.createElement('br')

  const playerName = document.createElement('input')
  playerName.setAttribute('placeHolder', 'Name')
  playerName.setAttribute('id', 'playerName')
  form.appendChild(message)
  form.appendChild(playerName)
  form.appendChild(br)
  form.appendChild(start)
  const playerScore = {
    name: '',
    time: ''
  }

  start.addEventListener('click', () => {
    playerScore.name = playerName.value
    playerNames.push(playerScore)
    form.removeChild(br)
    form.removeChild(playerName)
    form.removeChild(start)
    form.removeChild(message)
    body.insertBefore(pQuestions, form)
    body.insertBefore(pTimer, form)
    getQuestion(1)
    timerId = setInterval(countdown, 1000)
  })
}

function reset () {
  const message = document.createElement('h3')
  message.textContent = 'click on the reset button to start again'
  form.appendChild(message)
  const resetButton = document.createElement('button')
  resetButton.classList.add('button')
  resetButton.textContent = 'Reset'
  form.appendChild(resetButton)
  resetButton.addEventListener('click', () => {
    form.removeChild(resetButton)
    form.removeChild(message)
    body.removeChild(gameOver)
    scoreBoard.removeChild(orderList)
    body.removeChild(scoreBoard)
    StartGame()
  })
}
