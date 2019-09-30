// console.log('TCL: question1', question1.json())
// const htmlBody = document.querySelector('body')
// // console.log('TCL: htmlBody', htmlBody)
// const htmlQuestion = document.createElement('p')
// console.log('TCL: htmlQuestion', htmlQuestion)
// const obj
fetch('http://vhost3.lnu.se:20080/question/1', { mode: 'cors' })
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

function form (data) {
  const obj = data
  const htmlBody = document.querySelector('body')
  const form = document.createElement('form')
  const span = document.createElement('span')
  const br = document.createElement('br')
  span.textContent = obj.question
  form.setAttribute('method', 'post')
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  form.appendChild(span)
  form.appendChild(br)
  form.appendChild(input)
  const awnser = input.value
  htmlBody.appendChild(form)
}

fetch('http://vhost3.lnu.se:20080/answer/1', {
  method: 'post',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  body: 'foo=bar&lorem=ipsum'
})
  .then(json)
  .then(function (data) {
    console.log('Request succeeded with JSON response', data)
  })
  .catch(function (error) {
    console.log('Request failed', error)
  })
