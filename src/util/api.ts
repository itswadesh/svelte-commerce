import { WWW_URL } from '$lib/config'
import { loadingDelayed } from '$lib/store'
let typingTimer
import Cookie from 'cookie-universal'
const cookies = Cookie()
// let tkn = cookies.get('token')
const send = async ({ method, path, params, data, token, cookie }: any) => {
	// if (path === 'es/listings/favicon.png') return
	const store = await cookies.get('store')
	if (!store) {
		// console.log('Still loading cookie.........', path, params)
		// throw 'Loading...'
		return
	}
	const opts: any = {
		method,
		headers: {
			// Accept: 'application/json, text/plain, */*',
			// 'Content-Type': 'application/json',
			Cache: 'no-cache'
		}
	}
	if (data) {
		data.store = store.id //'6135b76e5dfeaf011301827d'
		const contentType = data?.files && data?.files[0]?.type
		if (
			!(
				contentType == 'image/jpeg' ||
				contentType == 'image/gif' ||
				contentType == 'image/png' ||
				contentType == 'image/ico' ||
				contentType == 'image/webp' ||
				contentType == 'application/pdf' ||
				contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
				contentType == 'application/msword' ||
				contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			)
		) {
			opts.headers['Content-Type'] = 'application/json'
			opts.body = JSON.stringify(data)
		} else {
			const form = new FormData()
			if (data && data.files) {
				for (const x of data.files) {
					form.append('files', x)
				}
			}
			for (const d in data) {
				if (d !== 'files') form.append(d, data[d])
			}
			opts.body = form
		}
	}
	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`
	}
	// else if (tkn) {
	// 	opts.headers['Authorization'] = `Bearer ${tkn}`
	// }
	const uri = new URL(`${WWW_URL}/api/${path}`)
	// console.log(uri)
	if (!params) params = {}
	params.store = store.id //'6135b76e5dfeaf011301827d'
	if (params) {
		Object.keys(params).forEach((key) => uri.searchParams.append(key, params[key]))
	}
	const url = uri.toString()
	// startDelayedLoadingIndicator()
	const response = await fetch(url, opts)
	cancelDelayedLoadingIndicator()
	const isJson = response.headers.get('content-type')?.includes('application/json')
	data = isJson ? await response.json() : await response.text()
	if (!response.ok && data) {
		throw { status: data.status, message: data.message }
	}
	return data
}

export const get = (path, params?, token?) => {
	return send({ method: 'GET', path, params, token })
}

export const del = (path, data) => {
	return send({ method: 'DELETE', path, data })
}

export const post = (path, data) => {
	return send({ method: 'POST', path, data })
}

export const put = (path, data) => {
	return send({ method: 'PUT', path, data })
}

const startDelayedLoadingIndicator = async () => {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(() => {
		loadingDelayed.set(true)
	}, 5000)
}

const cancelDelayedLoadingIndicator = async () => {
	clearTimeout(typingTimer)
	loadingDelayed.set(false)
}
