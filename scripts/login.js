const loadingIcon = document.getElementById('loadingIcon')


const login = {
	getValue: (name) => {
		return document.getElementById("loginForm").elements[name].value
	},
	setValue: (name, value) => {
		document.getElementById("loginForm").elements[name].value = value
	},
	disabledLogin: () => {
		document.getElementById("onLogin").setAttribute("disabled", "");
		loadingIcon.classList.remove('hide')
		loadingIcon.classList.add('show')
	},
	enableLogin: () => {
		document.getElementById("onLogin").removeAttribute("disabled", "");
		loadingIcon.classList.remove('show')
		loadingIcon.classList.add('hide')
	}
}

// after page is loaded

window.addEventListener('load', function () {
	const token = getCookie('token');
	if (token) {
		window.location.href = '/'
	}
})

async function onLogin() {
	const body = {
		username: login.getValue('username'),
		password: login.getValue('password')
	}
	login.disabledLogin()
	const { data: user, status } = await fetching({ url: '/users/login', body, methods: 'POST' })

	if (status === 200) {
		const token = user.token
		delete user.token

		setCookie('token', token, 0.5)
		setCookie('user', JSON.stringify(user), 0.5)

		window.location.href = '/'
	} else {
		alert(user.message)
	}
	login.enableLogin()
}