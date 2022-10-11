import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
import cookie from 'cookie'

export async function load({ params, parent, cookies, locals, request }) {
	// const ck = request.headers.get('cookie')
	// const c = cookie.parse(ck || '')
	// if (c.cart) locals.cart = JSON.parse(c.cart)
	const { store } = locals
	const { slug } = params
	let product = null
	let relatedProducts

	try {
		product = await gett(`products/${slug}`)
		relatedProducts = await gett(
			`es/products?store=${store?.id}&categories=${product.category?.slug}`
		)

		if (!product) throw error(404, 'Product not found')
		// cookies.set('cache-control', 'public, max-age=200')

		return { product, relatedProducts }
	} catch (e) {
		throw error(e.status, e.message)
	}
}
