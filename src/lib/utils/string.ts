import type { ToastType } from 'svelte-toasts/types/common'
import { currency as currencyConfig } from '../config'
import { toasts } from 'svelte-toasts'
import { goto } from '$app/navigation'

let allToasts: any

export const goback = () => {
	if (history.length < 3) {
		goto('/')
	} else {
		window.history.go(-1)
	}
}

export function constructURL2(url: string, fl: any) {
	url += '?'
	Object.keys(fl).forEach((e) => {
		if (e == 'page') return
		if (fl[e] && fl[e] !== 'undefined' && fl[e].length > 0)
			url += `${e}=${encodeURIComponent(fl[e])}&`
	})
	return url
}

export const delay = (delayInms: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(2)
		}, delayInms)
	})
}

export const getCdnImageUrl = ({ src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY = false }) => {
	const possibleImageUrls = [
		'https://s3.ap-south-1.amazonaws.com/litekart.in/',
		'https://misiki.s3.ap-south-1.amazonaws.com/',
		'https://cartflo.s3.me-central-1.amazonaws.com',
		'https://varnijewels.s3.amazonaws.com/'
	]
	let originalImageUrl = src
	let shouldAttachCdn = false
	for (const i of possibleImageUrls) {
		if (src?.includes(i)) {
			originalImageUrl = src.replace(i, '/')
			shouldAttachCdn = true
		}
	}
	if (shouldAttachCdn) {
		if (NO_QUERY) return originalImageUrl
		else return IMAGE_CDN_URL + originalImageUrl
	} else {
		return originalImageUrl
	}
}

export const getColorNameFromVarni = (value: string) => {
	const colorsGroup = [
		{
			color_codes: ['#aaaeee'],
			name: 'Rose'
		},
		{
			color_codes: ['#ffffff'],
			name: 'White'
		},
		{
			color_codes: ['#cccaaa', '#ffff00'],
			name: 'Yellow'
		}
	]

	for (const color of colorsGroup) {
		if (color.color_codes.includes(value)) {
			return color.name
		}
	}
}

const toast = (title, type) => {
	title =
		title?.body?.message?.error ||
		title?.body?.message ||
		title?.message?.error ||
		title?.message ||
		title?.error ||
		title ||
		''
	allToasts?.remove()
	allToasts = toasts.add({
		title: title,
		description: '',
		duration: 5000, // 0 or negative to avoid auto-remove
		type: type || 'info',
		theme: 'dark',
		placement: 'top-center',
		showProgress: false,
		onClick: () => { },
		onRemove: () => { }
		// component: BootstrapToast, // allows to override toast component/template per toast
	})
}

const removeToasts = () => {
	allToasts.remove()
}

export { toast, removeToasts }

export function date(value: string) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

export function dateOnly(value: string) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		month: 'short',
		day: '2-digit',
		year: 'numeric'
	})
}

export function time(value: string) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		hour: '2-digit',
		minute: '2-digit'
	})
}

export function truncate(text: string, stop: number, clamp: string) {
	if (text) return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
	else return ''
}

export function currency(value: any, currency = '$', decimals?: number) {
	const digitsRE = /(\d{3})(?=\d)/g
	value = parseFloat(value)
	if (!isFinite(value) || (!value && value !== 0)) return ''
	currency = currency != null ? currency.toUpperCase() : currencyConfig.symbol
	decimals = decimals != null ? decimals : 2
	const stringified = Math.abs(value).toFixed(decimals)
	const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
	const i = _int.length % 3
	const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
	const _float = decimals ? stringified.slice(-1 - decimals) : ''
	const sign = value < 0 ? '-' : ''
	return sign + currency + ' ' + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

export const serialize = (obj: any) => {
	var str = []
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		}
	return str.join('&')
}

export const removeNullish = (obj: any) =>
	Object.entries(obj).reduce((a: any, [k, v]) => (v ? ((a[k] = v), a) : a), {})

export const buildQueryFromObject: any = (search: string, prefix = '') =>
	Object.entries(search)
		.map(([key, value]) =>
			typeof value === 'object'
				? buildQueryFromObject(value, key)
				: `${prefix ? `${prefix}[${key}]` : `${key}`}=${value}`
		)
		.join('&')

export const getExtension = (filename) => {
	return filename.substring(filename.lastIndexOf('.') + 1)
}

export const generatePriceRange = (price_stats, currencySymbol) => {
	let priceRange = []
	const difference = Math.round(price_stats?.max - price_stats?.min)
	if (difference) {
		const priceGap = Math.round(difference / 4)
		if (priceGap) {
			const price1 = price_stats?.min
			const price2 = price1 + priceGap
			const price3 = price2 + priceGap
			const price4 = price3 + priceGap
			const price5 = price_stats?.max

			if (price1 >= 0 && price2 && price3 && price4 && price5) {
				priceRange = [
					{ from: price1, key: `Any`, to: price5 },
					{
						from: price1,
						key: `From ${currency(price1, currencySymbol)} to ${currency(price2, currencySymbol)}`,
						to: price2
					},
					{
						from: price2,
						key: `From ${currency(price2, currencySymbol)} to ${currency(price3, currencySymbol)}`,
						to: price3
					},
					{
						from: price3,
						key: `From ${currency(price3, currencySymbol)} to ${currency(price4, currencySymbol)}`,
						to: price4
					},
					{
						from: price4,
						key: `From ${currency(price4, currencySymbol)} to ${currency(price5, currencySymbol)}`,
						to: price5
					}
				]
			}
		}
	}
	return priceRange
}

export const getIdFromYoutubeVideo = (url) => {
	if (!url) return 'XXX'
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
	const match = url.match(regExp)
	return match && match[7].length == 11 ? match[7] : false
}

export const navigateToProperPath = (url) => {
	// console.log('url =', url);

	if (!url) {
		return '##'
		// } else if (url.startsWith('http')) {
		// 	const possibleDomainUrls = [
		// 		'https://zapvi.in/',
		// 		'https://a.zapvi.in/',
		// 		'https://b.zapvi.in/',
		// 		'https://next.zapvi.in/',
		// 		'https://live.zapvi.in/',
		// 		'https://localhost:3000/',
		// 		'https://localhost:3001/'
		// 	]

		// 	let originalUrl = url

		// 	for (const i of possibleDomainUrls) {
		// 		if (url?.includes(i)) {
		// 			originalUrl = url.replace(i, '/')
		// 		}
		// 	}
		// 	// console.log('originalUrl', originalUrl);
		// 	return originalUrl
	} else if (url[0] !== '/') {
		return `/${url.trim()}`
	} else {
		return url.trim()
	}

	// if (!url) return '##';

	// if (url[0] !== '/') {
	// 	return `/${url.trim()}`;
	// } else if (url.startsWith('http') && !url.includes(origin)) {
	// 	const urlObject = new URL(url);
	// 	return urlObject.pathname;
	// } else {
	// 	return url.trim();
	// }
}
