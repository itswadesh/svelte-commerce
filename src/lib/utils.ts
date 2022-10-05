import { PUBLIC_HTTP_ENDPOINT } from '$env/static/public'
import cookie from 'cookie'
export async function post(endpoint: string, data: any, ck?: any) {
	const ep = PUBLIC_HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `sid=${ck.get('sid')}`
		}
	})
	const sid = response.headers.get('set-cookie')
	const sidCookie = cookie.parse(sid)
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', sidCookie)
	ck.set('sid', sidCookie.sid)
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export async function gett(endpoint: string, ck?: any) {
	const ck1 = cookie.parse(ck || '')
	const ep = PUBLIC_HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `sid=${ck1.sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
