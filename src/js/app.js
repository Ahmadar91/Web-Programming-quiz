
/*
variables
*/

const inputText = document.createElement('input')
const body = document.querySelector('body')
// const input = document.querySelector('#input')
const button = document.querySelector('button')
const questionSpan = document.querySelector('#question')
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
const timer = document.querySelector('#timer')
let timeLeft = 20
let timerId
const playerNames = []
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

          questionSpan.textContent = data.question
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
      // endGame()
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
/*
button submit
*/
// button.addEventListener('click', e => {
//   const result = {
//     answer: ''
//   }
//   result.answer = inputText.value
//   postData(nextURL, result)
//   e.preventDefault()
//   removeTextInput()
//   timeLeft = 20
// })
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
        removeAltInput()
        timeLeft = 20
      })
    })
  }
}
// function submit (result) {
//   button.addEventListener('click', e => {
//     postData(nextURL, result)
//     removeAltInput()
//   })
// }
function removeAltInput () {
  while (form.hasChildNodes()) {
    form.removeChild(form.lastChild)
  }
}

function textQuestions () {
  countdown()
  inputText.setAttribute('type', 'text')
  const form = document.querySelector('#form')
  form.appendChild(inputText)
  const buttonText = document.createElement('button')
  const br = document.createElement('br')
  buttonText.textContent = 'submit'
  buttonText.classList.add('button')
  form.appendChild(br)
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
    form.removeChild(br)
  })
}
function endGame () {
  console.log('Congrats you won')
  const gameOver = document.createElement('p')
  gameOver.textContent = 'Game Over you Lost'
  const scoreBoard = document.createElement('div')
  scoreBoard.setAttribute('id', '#scoreBoard')
  let players
  gameOver.classList.add('red')
  body.appendChild(gameOver)
  clearTimeout(timerId)
  for (let i = 0; i < playerNames.length; i++) {
    players = document.createElement('p')
    players.textContent = '' + playerNames[i]
    scoreBoard.appendChild(players)
  }
}

// postData('http://vhost3.lnu.se:20080/answer/1', { answer: '2' })
// postData('http://vhost3.lnu.se:20080/answer/21', { answer: 'alt3' })
// postData('http://vhost3.lnu.se:20080/answer/326', { answer: 'alt3' })

function countdown () {
  if (timeLeft === -1) {
    clearTimeout(timerId)
    doSomething()
  } else {
    timer.innerHTML = timeLeft + ' seconds remaining'
    timeLeft--
  }
  if (timeLeft < 10) {
    timer.classList.add('red')
  }
  if (timeLeft > 10) {
    timer.classList.remove('red')
  }
}

function doSomething () {
  endGame()
}

function StartGame () {
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
  start.addEventListener('click', () => {
    playerNames.push(playerName.value)
    form.removeChild(br)
    form.removeChild(playerName)
    form.removeChild(start)
    form.removeChild(message)
    getQuestion(1)
    timerId = setInterval(countdown, 1000)
  })
}

StartGame()
// getQuestion(1)
