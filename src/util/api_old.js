import { API_URL } from '../../config'
import * as cookie from 'cookie'
export const get = async (url) => {
	const raw = await fetch(`${API_URL}/${url}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
	const result = await raw.json()
	return result
}

export const post = async (url, data, token) => {
	// return send({ method: 'POST', path, data, token })
	const raw = await fetch(`${API_URL}/${url}`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
	})
	const result = await raw.json()
	return result
}

async function send({ method, path, params, data, token }) {
	const opts = {
		method,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			Cache: 'no-cache',
			cookie,
		},
		// credentials: 'include', // Blocks cors requests. Need to enable proxy if uncommented
		mode: 'cors',
	}

	if (data) {
		// opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data)
	}
	const cookies = cookie.parse(headers.cookie || '')
	let tkn = cookies.get('token')
	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`
	} else if (tkn) {
		opts.headers['Authorization'] = `Bearer ${tkn}`
	}
	let url = new URL(`${API_URL}/${path}`)
	if (params) {
		Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
	}
	try {
		let response = await fetch(url, opts)
		let json = await response.text()
		if (!response.ok) {
			throw json
		}
		try {
			return JSON.parse(json)
		} catch (e) {
			return json
		}
	} catch (e) {
		throw e
	}
}
