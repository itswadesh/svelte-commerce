import { currency as currencyConfig, IMAGE_CDN_URL } from '../config'
import { toasts } from 'svelte-toasts'
import type { Product } from '$lib/types'

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

export const getCdnImageUrl = (src) => {
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
export const serialize = (obj: any) => {
	var str = []
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		}
	return str.join('&')
}

export const mapBigcommerceProducts = (b) => {
	if (b) {
		b.images = b.images.map((i) => i.url_standard)
		const prod: any = {
			id: b.id,
			name: b.name,
			type: b.type,
			sku: b.sku,
			description: b.description,
			images: b.images,
			weight: b.weight,
			width: b.width,
			depth: b.depth,
			height: b.height,
			price: b.price,
			mrp: b.cost_price,
			categories: b.categories,
			brandId: b.brand_id,
			stock: b.inventory_level,
			averageRating: b.reviews_rating_sum,
			totalReviews: b.reviews_count,
			approved: b.is_visible,
			featured: b.is_featured,
			related_products: b.related_products,
			warranty: b.warranty,
			upc: b.upc,
			mpn: b.mpn,
			gtin: b.gtin,
			keywords: b.keywords,
			availability: b.availability,
			sort: b.sort_order,
			condition: b.condition,
			title: b.page_title,
			metaKeywords: b.meta_keywords,
			metaDescription: b.meta_description,
			createdAt: b.date_created,
			updatedAt: b.date_modified,
			popularity: b.view_count
		}
		prod.img = b.images[0]
		return prod
	} else {
		return {}
	}
}

export const mapMedusajsProducts = (p: any) => {
	if (p) {
		const prod: Product = {
			_id: p.id,
			name: p.title,
			description: p.description,
			slug: p.handle,
			createdAt: p.created_at,
			modifiedAt: p.updated_at,
			img: p.thumbnail,
			// type: p.type,
			status: p.status,
			featured: p.featured,
			active: p.catalog_visibility,
			shortDescription: p.short_description,
			countryOfOrigin: p.origin_country,
			varified: p.purchasable,
			popularity: p.total_sales,
			digital: p.virtual,
			link: p.external_url,
			price: p.variants[0].prices[0].amount,
			stock: p.variants[0].inventory_quantity,
			sku: p.variants[0].sku,
			allow_backorder: p.variants[0].allow_backorder,
			manage_inventory: p.variants[0].manage_inventory,
			hsn: p.variants[0].hs_code,
			weight: p.weight,
			length: p.length,
			height: p.height,
			width: p.width,
			categories: p.collection,
			tags: p.tags,
			variations: p.variants,
			images: p.images.map((i: any) => {
				if (i) return i.url
			})
		}
		return prod
	} else {
		return {}
	}
}

export const mapWoocommerceProducts = (p) => {
	if (p) {
		const prod: any = {
			id: p.id,
			name: p.name,
			slug: p.slug,
			createdAt: p.date_created,
			modifiedAt: p.date_modified,
			type: p.type,
			status: p.status,
			featured: p.featured,
			active: p.catalog_visibility,
			description: p.description,
			short_description: p.short_description,
			sku: p.sku,
			price: p.price,
			mrp: p.regular_price,
			sale_price: p.sale_price,
			on_sale: p.on_sale,
			varified: p.purchasable,
			popularity: p.total_sales,
			digital: p.virtual,
			link: p.external_url,
			stock: p.stock_quantity,
			low_stock_amount: p.low_stock_amount,
			weight: p.weight,
			dimensions: p.dimensions,
			averageRating: p.average_rating,
			ratingRount: p.rating_count,
			categories: p.categories,
			tags: p.tags,
			attributes: p.attributes,
			default_attributes: p.default_attributes,
			variations: p.variations,
			grouped_products: p.grouped_products,
			related_products: p.related_ids,
			stock_status: p.stock_status,
			has_options: p.has_options,
			images: p.images.map((i) => {
				if (i) return i.src
			})
		}
		prod.img = prod.images[0]
		return prod
	} else {
		return {}
	}
}

export const removeNullish = (obj) =>
	Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

export const buildQueryFromObject = (search, prefix = '') =>
	Object.entries(search)
		.map(([key, value]) =>
			typeof value === 'object'
				? buildQueryFromObject(value, key)
				: `${prefix ? `${prefix}[${key}]` : `${key}`}=${value}`
		)
		.join('&')
