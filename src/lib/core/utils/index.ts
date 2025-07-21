import { goto } from '$app/navigation'
import { type ClassValue, clsx } from 'clsx'
import { toast as toastSooner } from 'svelte-sonner'
import { cubicOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

type FlyAndScaleParams = {
	y?: number
	x?: number
	start?: number
	duration?: number
}

export const flyAndScale = (node: Element, params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }): TransitionConfig => {
	const style = getComputedStyle(node)
	const transform = style.transform === 'none' ? '' : style.transform

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA
		const [minB, maxB] = scaleB

		const percentage = (valueA - minA) / (maxA - minA)
		const valueB = percentage * (maxB - minB) + minB

		return valueB
	}

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str
			return str + `${key}:${style[key]};`
		}, '')
	}

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0])
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1])

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			})
		},
		easing: cubicOut
	}
}

export function selectSort(value: string) {
	const url = new URL(window.location.href)
	if (value) url.searchParams.set('sort', value)
	else url.searchParams.delete('sort')
	url.searchParams.delete('page')
	goto(url, { replaceState: true })
}

export function formatSlug(slug: string) {
	return slug
		.replaceAll(/[^\w]/g, ' ')
		.trim()
		.replaceAll(/\s+/g, ' ')
		.replaceAll(/(^|\s)[a-z]/g, (x: string) => x.toUpperCase())
}

export const formatPrice = (price: number, currencyCode: string) => {
	// Default to USD if no currency code provided
	const code = currencyCode?.toUpperCase() || 'USD'

	// Comprehensive currency symbol mapping
	const currencySymbols: Record<string, string> = {
		AUD: '$', // Australian Dollar
		USD: '$', // US Dollar
		EUR: '€', // Euro
		GBP: '£', // British Pound
		JPY: '¥', // Japanese Yen
		CAD: '$', // Canadian Dollar
		CHF: 'Fr.', // Swiss Franc
		CNY: '¥', // Chinese Yuan
		INR: '₹', // Indian Rupee
		BRL: 'R$', // Brazilian Real
		RUB: '₽', // Russian Rubles
		KRW: '₩', // South Korean Won
		NZD: '$', // New Zealand Dollar
		MXN: '$', // Mexican Peso
		SGD: '$', // Singapore Dollar
		HKD: '$', // Hong Kong Dollar
		HUF: 'Ft', // Hungarian Forint
		ISK: 'kr', // Icelandic Króna
		CLP: '$', // Chilean Peso
		TWD: 'NT$', // Taiwan Dollar
		IDR: 'Rp', // Indonesian Rupiah
		VND: '₫' // Vietnamese Dong
		// Add more currencies as needed
	}

	// Get the symbol or use the code if symbol not found
	const symbol = currencySymbols[code] || code

	// List of currencies that don't use decimal places
	const nonDecimalCurrencies = ['JPY', 'KRW', 'HUF', 'ISK', 'CLP', 'TWD', 'IDR', 'VND']

	// Format the price - some currencies don't use decimal places
	const formattedPrice = nonDecimalCurrencies.includes(code) ? Math.round(price).toString() : price?.toFixed(2)

	// Special case for certain currencies: include the code after the price
	if (code === 'AUD' || code === 'CAD' || code === 'NZD' || code === 'SGD' || code === 'HKD' || code === 'JPY' || code === 'NZD' || code === 'MXN') {
		return `${symbol}${formattedPrice} ${code}`
	}

	// Default format for all other currencies: just symbol and price
	return `${symbol}${formattedPrice}`
}

export function date(value: string) {
	let date = new Date(`${value}Z`)

	if (date.toString() === 'Invalid Date') {
		date = new Date(value)
	}

	if (date.toString() === 'Invalid Date') {
		return value
	}

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

export function formatSecounds(seconds: number) {
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)

  let formattedOutput = ''
  if (seconds)
    formattedOutput = ` ${seconds % 60}s`
  if (minutes)
    formattedOutput = ` ${minutes % 60}m${formattedOutput}`
  if (hours)
    formattedOutput = `${hours}h${formattedOutput}`
  return formattedOutput.trim()
}

export function time(value: string) {
	const date = new Date(value)
	return date.toLocaleString(['en-US'], {
		hour: '2-digit',
		minute: '2-digit'
	})
}

export const timestampToAgo = (timestamp: string) => {
	const date = new Date(timestamp)
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const months = Math.floor(days / 30)
	const years = Math.floor(months / 12)

	if (years > 0) {
		return `${years} year${years > 1 ? 's' : ''} ago`
	}
	if (months > 0) {
		return `${months} month${months > 1 ? 's' : ''} ago`
	}
	if (days > 0) {
		return `${days} day${days > 1 ? 's' : ''} ago`
	}
	if (hours > 0) {
		return `${hours} hour${hours > 1 ? 's' : ''} ago`
	}
	if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
	}
	if (seconds > 0) {
		return `${seconds} second${seconds > 1 ? 's' : ''} ago`
	}
}

export function truncate(text: string, stop: number, clamp: string) {
	if (text) return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
	else return ''
}

export function hasPermission({
	userPermissions,
	menuPermissions,
	role,
	menuItemName
}: {
	userPermissions?: string[]
	menuPermissions?: string[]
	role?: string
	menuItemName?: string
}) {
	if (role === 'super' && menuItemName === 'Stores') {
		return true
	}

	if (role !== 'super' && menuItemName !== 'Stores') {
		if (!menuPermissions) return

		if (menuPermissions.includes('dashboard.list')) {
			return true
		}

		if (userPermissions?.length && menuPermissions?.length) {
			// Check if any menu permission exists in user permissions
			return userPermissions.some((userItem: string) => {
				return menuPermissions.includes(userItem && userItem)
			})
		}
	}

	return false
}

export const toast = (title: any, type: 'success' | 'info' | 'warning' | 'error') => {
	title = title?.body?.message?.error || title?.body?.message || title?.message?.error || title?.message || title?.error || title || ''
	if (type === 'success') {
		toastSooner.success(title)
		return
	}

	if (type === 'info') {
		toastSooner.info(title)
		return
	}

	if (type === 'warning') {
		toastSooner.warning(title)
		return
	}

	if (type === 'error') {
		toastSooner.error(title)
		return
	}

	toastSooner(title)
}

export const deepCopy = (obj: Record<string, any>) => {
	return JSON.parse(JSON.stringify(obj))
}

export const wait = (delay: number) => new Promise((res) => {
  setTimeout(res, delay)
})

export { debounce } from './debounce'

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T
