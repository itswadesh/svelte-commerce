import { currency as currencyConfig } from '../config'
import { toasts } from 'svelte-toasts'
import type { ToastType } from 'svelte-toasts/types/common'
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

export const getCdnImageUrl = (src: string, IMAGE_CDN_URL: string) => {
	if (src) {
		if (
			src.includes('https://s3.ap-south-1.amazonaws.com/litekart.in/') ||
			src.includes('https://misiki.s3.ap-south-1.amazonaws.com/') ||
			src.includes('https://varnijewels.s3.amazonaws.com/')
		) {
			const originalImageUrl = src
				.replace('https://s3.ap-south-1.amazonaws.com/litekart.in/', '/')
				.replace('https://misiki.s3.ap-south-1.amazonaws.com/', '/misiki/')
				.replace('https://varnijewels.s3.amazonaws.com/', '/')
			return IMAGE_CDN_URL + originalImageUrl
		} else {
			return src
		}
	}
}

const toast = (title: any, type: ToastType | undefined) => {
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
		onClick: () => { },
		onRemove: () => { }
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
	currency = currency != null ? currency : currencyConfig.symbol
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
