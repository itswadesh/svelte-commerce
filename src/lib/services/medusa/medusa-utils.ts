import type { AllOrders, AllProducts, Category, Order, Product, Cart } from '$lib/types'
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
			id: p.id,
			// createdAt: p.variants[0].created_at,
			// updatedAt: p.variants[0].updated_at,
			// deleted_at: p.variants[0].deleted_at,
			name: p.title,
			slug: p.handle,
			description: p.description,
			status: p.status,
			active: p.status === 'published' ? true : false,
			images: p.images?.map((i: any) => {
				if (i) return i.url
			}),
			img: p.thumbnail,
			// discountable: p.discountable,
			// external_id: p.external_id,
			variants: p.variants,
			sku: p.variants[0]?.sku,
			barcode: p.variants[0]?.barcode,
			ean: p.variants[0]?.ean,
			upc: p.variants[0]?.upc,
			hasStock: p.variants[0]?.inventory_quantity,
			// allow_backorder: p.variants[0]?.allow_backorder,
			// manage_inventory: p.variants[0]?.manage_inventory,
			hsn: p.variants[0]?.hs_code,
			countryOfOrigin: p.variants[0]?.origin_country,
			// mid_code: p.mid_code,
			// material: p.material,
			weight: p.variants[0]?.weight,
			height: p.variants[0]?.height,
			width: p.variants[0]?.width,
			length: p.variants[0]?.length,
			price: p.variants[0]?.prices?.length && p.variants[0]?.prices[0]?.amount,
			mrp: p.variants[0]?.original_price_incl_tax,
			discount:
				100 *
				((p.variants[0]?.original_price_incl_tax - p.variants[0]?.calculated_price_incl_tax) /
					p.variants[0]?.original_price_incl_tax),
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
			categoryPool: p.categories,
			// type_id: p.type_id,
			// type: p.type,
			tags: p.tags?.map((i: any) => {
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
			children: c.category_children
				? c.category_children.map((i: any) => {
						if (i) return mapMedusajsCategory(i)
				  })
				: []
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

// Cart data
export const mapMedusajsCart = (c: any) => {
	if (c) {
		return {
			id: c.id,
			uid: c.customer_id,
			cart_id: c.id,
			store: null,
			storeCurrency: c.region.currency_code,
			qty: c.items.reduce((total, item) => total + item.quantity, 0),
			currencyCode: c.region.currency_code,
			currencyName: c.region.currency_code,
			currencySymbol: null,
			discount: {
				code: null,
				amount: c.discount_total,
				formattedAmount: {
					value: c.discount_total,
					currency: c.region.currency_code
				}
			},
			subtotal: c.subtotal,
			shipping: {
				price: c.shipping_total,
				tax: c.shipping_tax_total,
				formattedPrice: {
					value: c.shipping_total,
					currency: c.region.currency_code
				}
			},
			tax: c.tax_total,
			total: c.total,
			offer_total: null,
			items: c.items?.map((item) => ({
				product: {
					id: item.variant.product_id,
					name: item.variant.product.title,
					sku: item.variant.sku,
					image: null // image is not present in the given data
				},
				quantity: item.quantity,
				price: item.unit_price,
				discount: null,
				formattedPrice: {
					value: item.unit_price,
					currency: null // currency code is not present in the given data
				}
			})),
			// unavailableItems: [],
			active: true,
			sid: c.id,
			formattedAmount: {
				subtotal: {
					value: c.subtotal,
					currency: c.region.currency_code
				},
				discount: {
					value: c.discount_total,
					currency: c.region.currency_code
				},
				shipping: {
					value: c.shipping_total,
					currency: c.region.currency_code
				},
				tax: {
					value: c.tax_total,
					currency: c.region.currency_code
				},
				total: {
					value: c.total,
					currency: c.region.currency_code
				}
			},
			needAddress: true,
			needPrescription: false,
			selfTakeout: false,
			codAvailable: false,
			createdAt: c.created_at,
			updatedAt: c.updated_at
		}
	}
	return null
}
