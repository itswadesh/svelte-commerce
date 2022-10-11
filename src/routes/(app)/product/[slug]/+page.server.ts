import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
import cookie from 'cookie'
export async function load({ params, parent, cookies, locals, request }) {
	// const ck = request.headers.get('cookie')
	// const c = cookie.parse(ck || '')
	// if (c.cart) locals.cart = JSON.parse(c.cart)
	const { slug } = params
	let product = null

	try {
		product = await gett(`products/${slug}`)
		// relatedProducts = await getAPI(
		// 	`products/frequently-bought-together?store=${store?.id}&groupId=${product?.groupId}`
		// )

		if (!product) throw error(404, 'Product not found')
		// cookies.set('cache-control', 'public, max-age=200')
		return { product }
	} catch (e) {
		throw error(e.status, e.message)
	}
}
