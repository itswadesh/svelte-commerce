import type { AllOrders, AllProducts, Category, Order, Product } from '$lib/types'
export const mapWoocommerceOrder = (o) => {
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

export const mapWoocommerceAllOrders = (p: any) => {
	if (p) {
		const allOrd: AllOrders = {
			count: p.count,
			// currentPage: p.currentPage,
			// pageSize: p.pageSize,
			limit: p.limit,
			data: p.orders.forEach(mapWoocommerceOrder)
		}
		return allOrd
	} else {
		return {}
	}
}
