import cookie from 'cookie'
import {
	BIG_COMMERCE_BASE_URL,
	HTTP_ENDPOINT,
	bigcommerceHeaders,
	provider,
	woocommerceHeaders
} from '../config'

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api' // node v-18
// const WooCommerceRestApi = pkg.default // node v-16
import { WOO_COMMERCE_STORE_LINK, WOO_COMMERCE_KEY, WOO_COMMERCE_SECRET } from '../config'
import { serialize } from '.'

const WooCommerce = new WooCommerceRestApi({
	url: WOO_COMMERCE_STORE_LINK,
	consumerKey: WOO_COMMERCE_KEY,
	consumerSecret: WOO_COMMERCE_SECRET,
	version: 'wc/v3'
})

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
export const getBySid = async (endpoint: string, sid?: any) => {
	const response = await fetch(HTTP_ENDPOINT + '/api/' + endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	// console.log('aaaaaaaaaaaaaaaaaa', endpoint, res)
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const getBigCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	// console.log(BIG_COMMERCE_BASE_URL + '/' + endpoint)
	const response = await fetch(BIG_COMMERCE_BASE_URL + '/' + endpoint + '?' + serialize(query), {
		headers: bigcommerceHeaders
	})
	// const totalPages = res?.meta?.pagination?.total_pages
	// const totalItems = res?.meta?.pagination?.total

	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	// console.log(res)
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const getWooCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	try {
		const res = await WooCommerce.get(endpoint + '?' + serialize(query))
		// const response = await fetch(
		// 	`${WOO_COMMERCE_STORE_LINK}/wp-json/wc/v3/${endpoint + '?' + serialize(query)}`,
		// 	{
		// 		headers: woocommerceHeaders
		// 	}
		// )
		// const isJson = response.headers.get('content-type')?.includes('application/json')
		// console.log(res)
		if (res?.status > 399) {
			throw { status: res.status, message: res }
		} else {
			return res
		}
	} catch (e) {
		// console.log('eeeeeeeeeeeeee', e.message)
	}
}
