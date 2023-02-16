const card = document.querySelector('.card')

async function onGetUsers() {
	const { data } = await fetching({ url: '/users' })
	clearCard()
	data.forEach(user => {
		displayCard(user)
	});
}

function clearCard() {
	const displayCard = document.getElementById('displayCard')
	displayCard.innerHTML = ''
}

function displayCard(data) {
	const displayCard = document.getElementById('displayCard')
	const clonedText = card.cloneNode(true)
	clonedText.classList.remove('hide')

	clonedText.querySelector('.title').textContent = data.name

	clonedText.childNodes[3].querySelector('.created-date').textContent = data.createdAt
	clonedText.childNodes[3].querySelector('.username').textContent = data.username

	clonedText.childNodes[5].querySelector('.status').textContent = data.is_active ? 'Disable' : 'Re-active'

	const elementId = uuid(5)

	clonedText.childNodes[5].querySelector('.status').setAttribute('id', elementId)
	clonedText.childNodes[5].querySelector('.status').onclick = function () {
		changeStatus(data.id, elementId, data.is_active)
	}

	displayCard.appendChild(clonedText)
}

async function changeStatus(id, uuid, status) {
	document.getElementById(uuid).setAttribute('disabled', '')
	const { status: updateStatus } = await fetching({ url: `/users/status/${id}`, methods: 'PUT', body: { status: !status } })
	document.getElementById(uuid).removeAttribute('disabled')

	if (updateStatus) {
		onGetUsers()
	}
}

function displayModal() {
	const body = document.getElementById('body')
	body.classList.add('show-modal')
	const modal = document.getElementById('createModal')
	modal.classList.remove('hide')
}
function hideModal() {
	const modal = document.getElementById('createModal')
	modal.classList.add('hide')
}

function getValue(name) {
	return document.getElementById("registerForm").elements[name].value
}

async function onCreateUser() {
	const body = {
		name: getValue('name'),
		password: getValue('password'),
		username: getValue('username'),
	}
	const { data: user, status } = await fetching({ url: '/users/register', body, methods: 'POST' })
	if (status === 201 || status === 200) {
		hideModal();
		onGetUsers()
	}
}

// JS start working
onGetUsers()