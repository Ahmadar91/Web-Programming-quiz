
// import fetch from 'node-fetch'

const input = document.querySelector('#input')
const button = document.querySelector('button')
const questionSpan = document.querySelector('#question')
let nextURL = ''
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
          return data
        })
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}

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
    const res = str.slice(36, str.length)
    console.log(data)
    console.log('TCL: postData -> res', res)
    getQuestion(res)
  })
}

button.addEventListener('click', () => {
  // answer = input.value
  const result = {
    answer: ''
  }
  result.answer = input.value
  postData(nextURL, result)
  console.log('TCL: answer', result)
})

getQuestion(1)
// postData('http://vhost3.lnu.se:20080/answer/1', { answer: '2' })
