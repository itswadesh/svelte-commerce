import { currency as currencyConfig } from '../config'
import { toasts } from 'svelte-toasts'
import type { AllOrders, AllProducts, Category, Order, Product } from '$lib/types'
import type { ToastProps, ToastType } from 'svelte-toasts/types/common'
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
		onClick: () => {},
		onRemove: () => {}
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

export const mapBigcommerceProducts = (b: any) => {
	if (b) {
		b.images = b.images.map((i: any) => i.url_standard)
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
			// currentPage: p.currentPage,
			// pageSize: p.pageSize,
			limit: p.limit,
			products: p.products.forEach(mapMedusajsProduct),
			facets: p.facets
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
			// created_at: p.variants[0].created_at,
			// updated_at: p.variants[0].updated_at,
			// deleted_at: p.variants[0].deleted_at,
			name: p.title,
			slug: p.handle,
			description: p.description,
			status: p.status,
			images: p.images.map((i: any) => {
				if (i) return i.url
			}),
			img: p.thumbnail,
			// discountable: p.discountable,
			// external_id: p.external_id,
			// variants: p.variants,
			sku: p.variants[0].sku,
			barcode: p.variants[0].barcode,
			ean: p.variants[0].ean,
			// upc: p.variants[0].upc,
			stock: p.variants[0].inventory_quantity,
			// allow_backorder: p.variants[0].allow_backorder,
			// manage_inventory: p.variants[0].manage_inventory,
			hsn: p.variants[0].hs_code,
			countryOfOrigin: p.variants[0].origin_country,
			// mid_code: p.mid_code,
			// material: p.material,
			weight: p.variants[0].weight,
			height: p.variants[0].height,
			width: p.variants[0].width,
			length: p.variants[0].length,
			price: p.variants[0].calculated_price_incl_tax,
			mrp: p.variants[0].original_price_incl_tax,
			discount:
				100 *
				((p.variants[0].original_price_incl_tax - p.variants[0].calculated_price_incl_tax) /
					p.variants[0].original_price_incl_tax),
			// options: p.variants[0].map((i: any) => {
			// 	if (i)
			// 		return {
			// 			name: i.value
			// 		}
			// }),
			// metaTitle: p.variants[0].metadata.title,
			// metaDescription: p.variants[0].metadata.description,
			// metaKeywords: p.variants[0].metadata.keywords,
			// price_without_tax: p.variants[0].original_price,
			// mrp_without_tax: p.variants[0].calculated_price,
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
			// sales_channels: p.sales_channels,
		}
		return prod
	} else {
		return {}
	}
}

export const mapMedusajsCategory = (c: any) => {
	if (c) {
		const r: Category = {
			id: c.id,
			name: c.name,
			slug: c.handle,
			children: c.category_children.map((i: any) => {
				if (i) return mapMedusajsCategory(i)
			})
		}
		return r
	} else {
		return {}
	}
}

export const mapMedusajsAllOrders = (p: any) => {
	if (p) {
		const allOrd: AllOrders = {
			count: p.count,
			// currentPage: p.currentPage,
			// pageSize: p.pageSize,
			limit: p.limit,
			data: p.orders.forEach(mapMedusajsOrder)
		}
		return allOrd
	} else {
		return {}
	}
}

export const mapMedusajsOrder = (o: any) => {
	if (o) {
		const ord: Order = {
			_id: o.id,
			status: o.status,
			paymentStatus: o.payment_status,
			cartId: o.cart_id,
			cart: {},
			customer: o.customer,
			address: o.address,
			// cart: o.cart,
			// customer_id: o.customer_id,
			// user: o.customer,
			orderItems: [],
			orderNo: '',
			updatedAt: o.updated_at,
			user: o.user,
			userEmail: o.email,
			billingAddress: o.billing_address.map((a: any) => {
				if (a)
					return {
						address: a.address_1,
						city: a.city,
						country: a.country_code,
						firstName: a.first_name,
						lastName: a.last_name,
						phone: a.phone,
						state: a.province,
						zip: a.postal_code
					}
			}),
			paySuccess: o.paid_total,
			totalAmountRefunded: o.refunded_total,
			amount: {
				currency: o.currency_code,
				discount: 100 * ((o.total - o.discount_total) / o.total),
				qty: o.items.length,
				shipping: o.shipping_total,
				subtotal: o.subtotal,
				tax: o.tax_total,
				total: o.total
			},
			items: o.items.map((i: any) => {
				if (i)
					return {
						_id: i.id,
						orderItemId: i.order_id,
						description: i.description,
						name: i.title,
						img: i.thumbnail,
						price: i.unit_price,
						total: i.total,
						subtotal: i.subtotal,
						tax: i.tax_total,
						qty: i.quantity
					}
			})
		}
		return ord
	} else {
		return {}
	}
}

export const mapWoocommerceProducts = (p: any) => {
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
			images: p.images.map((i: any) => {
				if (i) return i.src
			})
		}
		prod.img = prod.images[0]
		return prod
	} else {
		return {}
	}
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
