const baseUrl = 'http://127.0.0.1:8080'

function isValidHttpUrl(string) {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function fetching(data) {
	const params = {
		methods: 'GET',
		body: {},
		url: ''
	}
	const { methods, body, url } = data

	if (methods) params.methods = methods
	if (body) params.body = body
	if (url) params.url = url
	else return null;

	const fetchBody = {
		method: params.methods,
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getCookie('token')}`
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
	}

	if (body) {
		fetchBody.body = JSON.stringify(params.body)
	}

	const endpoint = isValidHttpUrl(params.url) ? params.url : `${baseUrl}${params.url}`

	const response = await fetch(endpoint, fetchBody);
	const responseData = await response.json()

	if (response.status === 401) {
		eraseCookie('token')
		eraseCookie('user')
		window.location.href = '/login.html'
	}

	return { data: responseData, status: ~~response.status };
}