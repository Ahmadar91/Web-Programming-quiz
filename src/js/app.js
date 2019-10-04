
// import fetch from 'node-fetch'

/*
variables
*/
const input = document.querySelector('#input')
const button = document.querySelector('button')
const questionSpan = document.querySelector('#question')
const radioQuestion = document.createElement('input')
const divRadio = document.querySelector('.radio')
radioQuestion.setAttribute('type', 'radio')
let alt
let br
radioQuestion.setAttribute('name', 'alt')
let nextURL = ''
let newData = {

}

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
            const radioArray = Object.values(newData.alternatives)
            for (let index = 0; index < radioArray.length; index++) {
              br = document.createElement('br')
              alt = document.createElement('input')
              alt.setAttribute('type', 'radio')
              alt.setAttribute('name', 'alt')
              alt.setAttribute('value', '' + radioArray[index])
              alt.textContent = radioArray[index]
              console.log('TCL: getQuestion -> alt', alt)
              divRadio.appendChild(alt)
              divRadio.appendChild(br)
            }
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
    const res = str.slice(36, str.length)
    console.log(data)
    console.log('TCL: postData -> res', res)
    getQuestion(res)
  })
}
/*
button submit
*/
button.addEventListener('click', () => {
  const result = {
    answer: ''
  }
  result.answer = input.value
  postData(nextURL, result)
  console.log('TCL: answer', result)
})

getQuestion(1)
// postData('http://vhost3.lnu.se:20080/answer/1', { answer: '2' })
