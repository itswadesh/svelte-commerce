import { currency as currencyConfig } from '../config'
import { toasts } from 'svelte-toasts'
import { browser } from '$app/env'
let allToasts
let debounceTimer
import Cookie from 'cookie-universal'
import { get } from './api'
const cookies = Cookie()
let storeDetails = cookies.get('store')
export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
export function decideListingNavigation({ type, slug }) {
	let finalLink = `/${slug}`
	if (type === 'Restaurant') finalLink = `/restaurant/${slug}`
	if (type === 'Saloon') finalLink = `/saloon/${slug}`
	if (type === 'Pharmacy') finalLink = `/pharmacy/${slug}`
	return finalLink
}
export async function requestLocationPermissionFromUser() {
	try {
		if (!browser) return null
		const res = await get(`ip`)
		if (!res) return null
		const { country, region, city, timezone, ll } = res
		const speed = 0
		const accuracy = 0
		const lat = ll[0]
		const lng = ll[1]
		cookies.set(
			'geo',
			{ lat, lng, speed: 0, accuracy: 0, country, region, timezone, city },
			{ path: '/' }
		)
		return { lat, lng, speed, accuracy }
	} catch (e) {
		return null
	}
}
async function getLocation() {
	return new Promise(async (resolve, reject) => {
		if (!('geolocation' in navigator)) {
			reject('Geolocation is not available.')
		}
		try {
			function geoSuccess(pos) {
				var crd = pos.coords
				resolve(pos)
			}

			function geoError(err) {
				console.warn(`ERROR(${err?.code}): ${err?.message}`)
				reject(err)
			}
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
		} catch (err) {
			reject(err)
		}
	})
}
const toast = (title, type) => {
	if (title?.message) title = title?.message
	allToasts?.remove()
	allToasts = toasts.add({
		title: title,
		description: '',
		duration: 5000, // 0 or negative to avoid auto-remove
		type: type || 'info',
		theme: 'dark',
		placement: 'top-center',
		showProgress: false,
		onClick: () => {},
		onRemove: () => {}
		// component: BootstrapToast, // allows to override toast component/template per toast
	})
}
const removeToasts = (toast) => {
	allToasts.remove()
}
function constructQry(url, fl) {
	url += '?'
	Object.keys(fl).forEach((e) => {
		if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0) url += `${e}=${fl[e]}&`
	})
	return url
}
function constructURL2(url, fl) {
	url += '?'
	Object.keys(fl).forEach((e) => {
		if (e == 'page') return
		if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0) url += `${e}=${fl[e]}&`
	})
	return url
}
function constructURL(url, category, fl) {
	if (category) url += category + '?'
	Object.keys(fl).forEach((e) => {
		// if (e == 'limit' || e == 'skip') return
		if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0) url += `${e}=${fl[e]}&`
	})
	return url
}
function first(text) {
	if (!text) return text
	return text.substring(0, 1).toUpperCase()
}
function date(value) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}
function truncate(text, stop, clamp) {
	if (text) return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
	else return ''
}
function currency(value, currency?, decimals?) {
	const digitsRE = /(\d{3})(?=\d)/g
	value = parseFloat(value)
	if (!isFinite(value) || (!value && value !== 0)) return ''
	currency = currency != null ? currency : currencyConfig.symbol
	decimals = decimals != null ? decimals : 0
	let stringified = Math.abs(value).toFixed(decimals)
	let _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
	let i = _int.length % 3
	let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
	let _float = decimals ? stringified.slice(-1 - decimals) : ''
	let sign = value < 0 ? '-' : ''
	return sign + currency + ' ' + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}
export {
	constructURL,
	constructQry,
	constructURL2,
	first,
	currency,
	date,
	truncate,
	toast,
	removeToasts,
	storeDetails as store
}
