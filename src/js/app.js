
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
  const answer = input.value
  // postData(obj.nextURL, answer.json())
  console.log('TCL: form -> answer.json()', answer.json())
  button.addEventListener('click', () => {
    const answer = input.value
    postData(obj.nextURL, answer.json())
    console.log('TCL: form -> answer.json()', answer.json())
  })
}

async function getQuestion (id) {
  await window.fetch(`http://vhost3.lnu.se:20080/question/${id}`, { mode: 'cors' })
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

async function postData (url = '', data = { answer: '2' }) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

getQuestion(1)
// postData()
