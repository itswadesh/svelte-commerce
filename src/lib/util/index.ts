import { currency as currencyConfig, IMAGE_CDN_URL } from '../config'
import { toasts } from 'svelte-toasts'
let allToasts
export function constructURL2(url, fl) {
	url += '?'
	Object.keys(fl).forEach((e) => {
		if (e == 'page') return
		if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0)
			url += `${e}=${encodeURIComponent(fl[e])}&`
	})
	return url
}
export const delay = (delayInms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(2)
		}, delayInms)
	})
}

export const getCdnImageUrl = (src, tr) => {
	if (src) {
		const originalImageUrl = src
			.replace('https://s3.ap-south-1.amazonaws.com/litekart.in/', '/')
			.replace('https://misiki.s3.ap-south-1.amazonaws.com/', '/misiki/')
			.replace('https://varnijewels.s3.amazonaws.com/', '/')
		return IMAGE_CDN_URL + originalImageUrl
		// return originalImageUrl + tr
	}
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
export { toast, removeToasts }
export function date(value) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}
export function dateOnly(value) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		month: 'short',
		day: '2-digit',
		year: 'numeric'
	})
}
export function time(value) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		hour: '2-digit',
		minute: '2-digit'
	})
}
export function truncate(text, stop, clamp) {
	if (text) return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
	else return ''
}
export function currency(value, currency = '₹', decimals?) {
	const digitsRE = /(\d{3})(?=\d)/g
	value = parseFloat(value)
	if (!isFinite(value) || (!value && value !== 0)) return ''
	currency = currency != null ? currency : currencyConfig.symbol
	decimals = decimals != null ? decimals : 0
	const stringified = Math.abs(value).toFixed(decimals)
	const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
	const i = _int.length % 3
	const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
	const _float = decimals ? stringified.slice(-1 - decimals) : ''
	const sign = value < 0 ? '-' : ''
	return sign + currency + ' ' + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}
