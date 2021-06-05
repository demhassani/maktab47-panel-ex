const items = document.querySelectorAll('.list-group>li')
const modalBtn = document.querySelector('.modal-btn')
const form_Data = document.querySelector('.form-data')
const form = document.querySelector('#createForm')
const title = document.querySelector('#title')
let numberPages = 1
let currentPage = 'Orders'
let numberCurrentPage = 1
let perPage = 5

function make_table(id) {
	form_Data.innerHTML = ''
  fetch(`http://localhost:3000/${id}`).then(res => res.json()).then(res => {

	let head = '<th scope="col">#</th>'
	let body = ''
	//generate head of table
	for (let obj of res) {	
		delete obj.id
	  for (let item in obj) {
		head += ` <th scope="col">${item}</th>`

			form_Data.innerHTML+=`<div class="mb-3">
			<label for="${item}" class="form-label">${item}</label>
			<input name='${item}' type="text" class="form-control" id="${item}">
		  </div>`

	  }
	  break
	}

	// generate body of table
	let counter = 1
	for (let obj of res) {
		delete obj.id
	  body += `<tr>
					<th>${counter++}</th>`
	  for (let item in obj)
		body += `<th>${obj[item]}</th>`

	  body += '</tr>'
	  if (counter == perPage + 1)
		break
	}
	   
	makePagination(res.length, perPage)

	document.querySelector('.lds-ripple').style.display = 'none'
	document.querySelector('thead tr').innerHTML = head
	document.querySelector('tbody').innerHTML = body
	document.querySelector('#title').innerHTML =''
	new TypeIt('#title', {
	  strings: id
	}).go();


  }).catch(e => alert(e.message))
}


function makePagination(numbers, per_page) {
  let pagination = '<li class="page-item disabled">               ' +
	  '                   <a class="page-link" href="#" tabindex="-1" onclick="event.preventDefault();gochangeTable(-1)"        aria-disabled="true">Prev</a>\n           ' +
	  '             </li>' +
	  '             <li class="page-item active">' +
	  '                   <a class="page-link" href="#" id="page_1" onclick=" event.preventDefault();changeTable (this.id)">1</a>' +
	  '             </li>'

  numberPages = Math.ceil(numbers / per_page)

  for (let i = 2; i <= numberPages; i++) {
	pagination += `<li class="page-item"><a class="page-link" href="#" id="page_${i}" onclick="
									event.preventDefault();changeTable(this.id)">${i}</a>
							   </li>`
  }

  pagination += `<li class="page-item ${+numberPages < 2 ? 'disabled':''}">\n                <a class="page-link" href="#" onclick="event.preventDefault();gochangeTable(1)">Next</a>\n            </li>`
  document.querySelector("#pagination").innerHTML = pagination
}


function changeTable(number) {
  number = +number.replace("page_", '')
  let request = `${currentPage}?_page=${number}&_limit=${perPage}`
  paginationFetch(request);

  document.querySelector("#page_" + numberCurrentPage).parentElement.classList.remove("active")
  document.querySelector("#page_" + number).parentElement.classList.add("active")
  numberCurrentPage = number;

  if (numberCurrentPage === 1)
	document.querySelector("#pagination").firstElementChild.classList.add("disabled")
  else
	document.querySelector("#pagination:first-child").firstElementChild.classList.remove("disabled")
  if (numberCurrentPage === numberPages)
	document.querySelector("#pagination:last-child").lastElementChild.classList.add("disabled")
  else
	document.querySelector("#pagination:last-child").lastElementChild.classList.remove("disabled")
}

function gochangeTable(change) {
  changeTable('page_' + (numberCurrentPage + change))
}

function paginationFetch(id) {
  fetch(`http://localhost:3004/${id}`).then(res => res.json()).then(res => {
	let body = ''
	// generate body of table
	let counter = 1
	for (let obj of res) {
	  body += `<tr>
					<th>${counter++}</th>`
	  for (let item in obj)
		body += `<th>${obj[item]}</th>`

	  body += '</tr>'
	}

	document.querySelector('tbody').innerHTML = body
  })
}

const urlCorrection = function (text) {
  return decodeURI(text).split(' ').join('-')
}

items.forEach((item) => {
  item.addEventListener('click', e => {
	e.preventDefault()
	location.hash = urlCorrection(item.innerText)
	if (item.innerText === 'Dashboard') {
	  make_table('Orders')
	  return
	}

	make_table(urlCorrection(item.innerText))


  })
})


if (location.hash) {
	let item
	let a
	let pat = new RegExp(`(${location.hash.split('#')[1]})\\b`)
	for (x of items) {
		if (pat.test(urlCorrection(x.innerText))) {
			item = x
			a = true
		}
	}
	if (!a) {
		location.hash = ''
		location.reload()
	} else {
	if (item.innerText === 'Dashboard') {
		make_table(urlCorrection('orders'))
	} else
		make_table(urlCorrection(item.innerText))
	}

	} else {
	 make_table('orders')
}

modalBtn.onclick=function(){
	let title = document.querySelector('#title')
	let modal = document.querySelector('.modal-title')
	modal.innerHTML = title.innerHTML

}
const handleForm = function(e){
	e.preventDefault()
	const data = new FormData(e.target)
	const formJSON = Object.fromEntries(data.entries())

fetch(`http://localhost:3004/${title.innerText.split('|')[0]}`,
{
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	method: "POST",
	body: JSON.stringify(formJSON, null, 2)
})
.then(() => location.reload())
}

form.addEventListener('submit',handleForm)
