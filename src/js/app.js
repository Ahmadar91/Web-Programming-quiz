// console.log('TCL: question1', question1.json())
// const htmlBody = document.querySelector('body')
// // console.log('TCL: htmlBody', htmlBody)
// const htmlQuestion = document.createElement('p')
// console.log('TCL: htmlQuestion', htmlQuestion)
// const obj

async function getQuestion () {
  const res = await window.fetch('http://vhost3.lnu.se:20080/question/1', { mode: 'cors' })
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status)
          return
        }
        // Examine the text in the response
        response.json().then(function (data) {
          console.log(data)
          form(data)
        //  obj = data
        // htmlQuestion.textContent = obj.question
        // htmlBody.appendChild(htmlQuestion)
        })
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}
function form (data) {
  const obj = data
  const htmlBody = document.querySelector('body')
  const form = document.createElement('form')
  const span = document.createElement('span')
  const br = document.createElement('br')
  const button = document.createElement('button')
  button.textContent = 'Next Question'
  button.addEventListener('click', event => {
            console.log(event)
  })
  span.textContent = obj.question
  form.setAttribute('method', 'post')
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  form.appendChild(span)
  form.appendChild(br)
  form.appendChild(input)
  const answer = input.value
  htmlBody.appendChild(form)
}
async function SendAnswer (input) {
  const data = {
    answer: input
  }
  const res = await window.fetch('http://vhost3.lnu.se:20080/answer/1', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(json)
    .then(function (data) {
      console.log('Request succeeded with JSON response', data)
    })
    .catch(function (error) {
      console.log('Request failed', error)
    })
}

getQuestion()
SendAnswer()