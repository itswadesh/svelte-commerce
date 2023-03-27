import { error } from '@sveltejs/kit'
import { ProductService } from '$lib/services'

export const prerender = false

export async function load({ url, locals, cookies, context }) {
	const pid = url.searchParams.get('pid')
	const ref = url.searchParams.get('ref')

	let product

	try {
		product = await ProductService.fetchProduct({
			id: pid,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		// console.log('zzzzzzzzzzzzzzzzzz', product)

		if (!product) throw error(404, 'Product not found')

		return { ref, product }
	} catch (e) {
		console.error(e)
		throw error(e.status, e.message || 'Not found')
	}
}
