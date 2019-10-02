// import fetch from 'node-fetch'

function form (data) {
  const obj = data
  const htmlBody = document.querySelector('body')
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', obj.nextURL)
  const span = document.createElement('span')
  span.textContent = obj.question
  const br = document.createElement('br')
  const br1 = document.createElement('br')
  const button = document.createElement('button')
  button.setAttribute('type', 'submit')
  button.textContent = 'Next Question'
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  form.appendChild(span)
  form.appendChild(br)
  form.appendChild(input)
  form.appendChild(br1)
  form.appendChild(button)
  htmlBody.appendChild(form)
  const value = document.createElement('p')
  value.setAttribute('id', 'values')
  htmlBody.appendChild(value)

  const result = {
    answer: ''
  }
  console.log(result)
  const log = document.getElementById('values')
  input.addEventListener('input', updateValue)
  console.log(obj.nextURL)
  function updateValue (e) {
    log.textContent = e.target.value
    result.answer = e.target.value
  }
  button.addEventListener('click', () => {
    postData(obj.nextURL, result)
  })
}

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
          form(data)
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
getQuestion(1)
// postData('http://vhost3.lnu.se:20080/answer/1', { answer: '2' })
