import type { AllOrders, AllProducts, Category, Order, Product, Cart } from '$lib/types'

export const mapMedusajsAllProducts = (p: any) => {
	if (p) {
		const allProd = {
			count: p.count,
			// currentPage: p.currentPage,
			// pageSize: p.pageSize,
			limit: p.limit,
			data: p.products.map(mapMedusajsProduct),
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
			variants: p.variants?.map((v) => ({
				allow_backorder: v.allow_backorder,
				barcode: v.barcode,
				calculated_price: v.calculated_price / 100,
				calculated_price_incl_tax: v.calculated_price_incl_tax / 100,
				calculated_price_type: v.calculated_price_type,
				calculated_tax: v.calculated_tax / 100,
				created_at: v.created_at,
				deleted_at: v.deleted_at,
				ean: v.ean,
				height: v.height,
				hs_code: v.hs_code,
				id: v.id,
				inventory_quantity: v.inventory_quantity,
				length: v.length,
				manage_inventory: v.manage_inventory,
				material: v.material,
				metadata: v.metadata,
				mid_code: v.mid_code,
				origin_country: v.origin_country,
				original_price: v.original_price / 100,
				original_price_incl_tax: v.original_price_incl_tax / 100,
				original_tax: v.original_tax / 100,
				prices: v.prices,
				product_id: v.product_id,
				sku: v.sku,
				tax_rates: v.tax_rates / 100,
				title: v.title,
				upc: v.upc,
				updated_at: v.updated_at,
				variant_rank: v.variant_rank,
				weight: v.weight,
				width: v.width
			})),
			// moreProductDetails: { pg: { variants: p.variants } },
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
			price: p.variants[0]?.prices[0]?.amount / 100,
			mrp: p.variants[0] && p.variants[0]?.original_price_incl_tax / 100,
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

export const mapMedusajsAllOrders = (o: any) => {
	if (o) {
		const allOrd: AllOrders = {
			count: o?.count,
			pageSize: o?.limit,
			currentPage: o?.page || 1,
			data: o?.orders.map((oo) => mapMedusajsOrder(oo))
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
			customer: o.customer,
			// cart: o.cart,
			// customer_id: o.customer_id,
			// user: o.customer,
			orderItems: o.items.map((i: any) => {
				if (i)
					return {
						_id: i.id,
						orderItemId: i.order_id,
						description: i.description,
						name: i.title,
						slug: i.handle,
						img: i.thumbnail,
						price: i.unit_price / 100,
						total: i.total / 100,
						subtotal: i.subtotal / 100,
						tax: i.tax_total / 100,
						qty: i.quantity
					}
			}),
			orderNo: o.id,
			createdAt: o.created_at,
			updatedAt: o.updated_at,
			user: o.user,
			userEmail: o.email,
			billing_address: o.billing_address.map((a: any) => {
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
			shipping_address: o.shipping_address.map((a: any) => {
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
			paySuccess: o.paid_total / 100,
			totalAmountRefunded: o.refunded_total / 100,
			amount: {
				currency: o.currency_code,
				discount: 100 * ((o.total - o.discount_total) / o.total),
				qty: o.items.length,
				shipping: o.shipping_total / 100,
				subtotal: o.subtotal / 100,
				tax: o.tax_total / 100,
				total: o.total / 100
			},
			items: o.items.map((i: any) => {
				if (i)
					return {
						_id: i.id,
						orderItemId: i.order_id,
						description: i.description,
						name: i.title,
						img: i.thumbnail,
						price: i.unit_price / 100,
						total: i.total / 100,
						subtotal: i.subtotal / 100,
						tax: i.tax_total / 100,
						qty: i.quantity
					}
			})
		}
		return ord
	} else {
		return {}
	}
}

// Cart data
export const mapMedusajsCart = (c: any) => {
	if (c) {
		return {
			billingAddress: c.billing_address,
			cart_id: c.id,
			currencyCode: c.region.currency_code,
			currencyName: c.region.currency_code,
			currencySymbol: null,
			discount: {
				code: null,
				amount: c.discount_total / 100,
				formattedAmount: {
					value: c.discount_total / 100,
					currency: c.region.currency_code
				}
			},
			formattedAmount: {
				subtotal: {
					value: c.subtotal / 100,
					currency: c.region.currency_code
				},
				discount: {
					value: c.discount_total / 100,
					currency: c.region.currency_code
				},
				shipping: {
					value: c.shipping_total / 100,
					currency: c.region.currency_code
				},
				tax: {
					value: c.tax_total / 100,
					currency: c.region.currency_code
				},
				total: {
					value: c.total / 100,
					currency: c.region.currency_code
				}
			},
			id: c.id,
			items: c.items?.map((item) => ({
				id: item.id,
				pid: item.id,
				vid: item.variant_id,
				name: item.title,
				description: item.description,
				sku: item.sku,
				img: item.thumbnail,
				qty: item.quantity,
				price: item.unit_price / 100,
				mrp: item.unit_price / 100,
				discount: 0,
				formattedItemAmount: {
					price: c.region.currency_code.toUpperCase() + ' ' + item.unit_price / 100
				}
			})),
			offer_total: null,
			qty: c.items.reduce((total, item) => total + item.quantity, 0),
			shipping: {
				price: c.shipping_total / 100,
				tax: c.shipping_tax_total / 100,
				formattedPrice: {
					value: c.shipping_total / 100,
					currency: c.region.currency_code
				}
			},
			active: true,
			codAvailable: false,
			createdAt: c.created_at,
			needAddress: true,
			needPrescription: false,
			selfTakeout: false,
			shippingAddress: c.shipping_address,
			sid: c.id,
			slug: c.handle,
			store: null,
			storeCurrency: c.region.currency_code,
			subtotal: c.subtotal / 100,
			tax: c.tax_total / 100,
			total: c.total / 100,
			uid: c.customer_id,
			// unavailableItems: [],
			updatedAt: c.updated_at
		}
	}
	return null
}
