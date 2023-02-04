import { currency as currencyConfig, IMAGE_CDN_URL } from '../config'
import { toasts } from 'svelte-toasts'
import type { AllProducts, Product } from '$lib/types'

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

export const mapMedusajsAllProducts = (p: any) => {
	if (p) {
		const allProd: AllProducts = {
			count: p.count,
			// currentPage: p.count,
			// pageSize: p.count,
			limit: p.limit,
			products: p.products.forEach(mapMedusajsProduct)
		}
		return allProd
	} else {
		return {}
	}
}

export const mapMedusajsProduct = (p: any) => {
	if (p) {
		const prod: Product = {
			_id: p.id,
			name: p.title,
			slug: p.handle,
			description: p.description,
			status: p.status,
			images: p.images.map((i: any) => {
				if (i) return i.url
			}),
			img: p.thumbnail,
			// variants: p.variants,
			sku: p.variants[0].sku,
			barcode: p.variants[0].barcode,
			ean: p.variants[0].ean,
			stock: p.variants[0].inventory_quantity,
			// allow_backorder: p.variants[0].allow_backorder,
			hsn: p.variants[0].hs_code,
			countryOfOrigin: p.variants[0].origin_country,
			// mid_code: p.mid_code,
			// material: p.material,
			weight: p.variants[0].weight,
			height: p.variants[0].height,
			width: p.variants[0].width,
			length: p.variants[0].length,
			// options: p.variants[0].map((i: any) => {
			// 	if (i)
			// 		return {
			// 			name: i.title
			// 		}
			// }),
			// created_at: p.variants[0].created_at,
			// updated_at: p.variants[0].updated_at,
			// deleted_at: p.variants[0].deleted_at,
			// metaTitle: p.variants[0].metadata.title,
			// metaDescription: p.variants[0].metadata.description,
			// metaKeywords: p.variants[0].metadata.keywords,
			// price_without_tax: p.variants[0].original_price,
			// mrp_without_tax: p.variants[0].calculated_price,
			price: p.variants[0].calculated_price_incl_tax,
			mrp: p.variants[0].original_price_incl_tax,
			discount: p.variants[0].prices[0].discount,
			// original_tax: p.variants[0].prices[0].original_tax,
			// calculated_tax: p.variants[0].prices[0].calculated_tax,
			// tax_rates: p.variants[0].prices[0].tax_rates,
			// profile_id: p.profile_id,
			// profile: p.profile,
			// collection_id: p.collection_id,
			categoryPool: p.collection,
			// type_id: p.type_id,
			// type: p.type,
			tags: p.tags.map((i: any) => {
				if (i)
					return {
						type: 'Ribbon',
						name: i.value
					}
			})
			// discountable: p.discountable,
			// external_id: p.external_id,
			// sales_channels: p.sales_channels,
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
