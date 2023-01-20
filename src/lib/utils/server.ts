import cookie from 'cookie'
import { BIG_COMMERCE_BASE_URL, HTTP_ENDPOINT, bigcommerceHeaders, provider } from '../config'
export async function post(endpoint: string, data: any, ck?: any) {
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
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
	ck.set('sid', sidCookie.sid, {
		path: '/'
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
export async function gett(endpoint: string, ck?: any) {
	const ck1 = cookie.parse(ck || '')
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
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
export async function getBySid(endpoint: string, sid?: any) {
	let response
	switch(provider){
		case 'litekart':
			response = await fetch( HTTP_ENDPOINT + '/api/' + endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: { cookie: `sid=${sid}` }
		})
		break
		case 'bigcommerce':
			response = await fetch(BIG_COMMERCE_BASE_URL + '/' + endpoint, { headers:bigcommerceHeaders })
			// const totalPages = res?.meta?.pagination?.total_pages
			// const totalItems = res?.meta?.pagination?.total
		break
		case 'woocommerce':
			response = await fetch(BIG_COMMERCE_BASE_URL + '/' + endpoint, { headers:bigcommerceHeaders })
		break
	}
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