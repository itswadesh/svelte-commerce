import { WWW_URL } from '../../config'
import Cookie from 'cookie-universal'
const cookies = Cookie()
let tkn = cookies.get('token')
const send = async ({ method, path, params, data, token, cookie }: any) => {
	const opts: any = {
		method,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			Cache: 'no-cache',
		},
	}
	if (data) {
		// opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data)
	}
	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`
	} else if (tkn) {
		opts.headers['Authorization'] = `Bearer ${tkn}`
	}
	let uri = new URL(`${WWW_URL}/api/${path}`)
	if (params) {
		Object.keys(params).forEach((key) => uri.searchParams.append(key, params[key]))
	}
	const url = uri.toString()
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

export const get = (path, params?, token?) => {
	return send({ method: 'GET', path, params, token })
}

export const del = (path) => {
	return send({ method: 'DELETE', path })
}

export const post = (path, data) => {
	return send({ method: 'POST', path, data })
}

export const put = (path, data) => {
	return send({ method: 'PUT', path, data })
}
