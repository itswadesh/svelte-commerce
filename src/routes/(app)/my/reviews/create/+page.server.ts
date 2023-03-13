import { error } from '@sveltejs/kit'
import { ProductService } from '$lib/services'

export const prerender = false

export async function load({ url, locals, cookies, context }) {
	const ref = url.searchParams.get('ref')
	const productId = url.searchParams.get('product')
	let product

	try {
		product = await ProductService.fetchProduct({
			id: productId,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		if (!product) throw error(404, 'Product not found')

		return { ref, product}
	} catch (e) {
		throw error(e.status, e.message || 'Not found')
	} 
}
