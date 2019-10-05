
/*
variables
*/
const inputText = document.createElement('input')
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
      endGame()
      return
    }
    const res = str.slice(36, str.length)
    console.log(data)
    console.log('TCL: postData -> res', res)
    getQuestion(res)
  }).catch(function (err) {
    console.log('Fetch Error :-S', err)
  })
}
/*
button submit
*/
button.addEventListener('click', e => {
  const result = {
    answer: ''
  }
  result.answer = inputText.value
  postData(nextURL, result)
  e.preventDefault()
  removeTextInput()
})
function altQuestions () {
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
      button.addEventListener('click', e => {
        postData(nextURL, altResult)
        removeAltInput()
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

function removeTextInput () {
  form.removeChild(inputText)
}

function textQuestions () {
  inputText.setAttribute('type', 'text')
  const form = document.querySelector('#form')
  form.appendChild(inputText)
}
function endGame () {
  console.log('Congrats you won')
}
getQuestion(1)
// postData('http://vhost3.lnu.se:20080/answer/1', { answer: '2' })
// postData('http://vhost3.lnu.se:20080/answer/21', { answer: 'alt3' })
// postData('http://vhost3.lnu.se:20080/answer/326', { answer: 'alt3' })
