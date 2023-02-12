import { fetchProduct } from '$lib/services/ProductService'
export const prerender = false

export async function load({ url, locals, cookies, context }) {
	const ref = url.searchParams.get('ref')
	const productId = url.searchParams.get('product')
	let product

	try {
		product = await fetchProduct({
			id: productId,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
	} catch (e) {
	} finally {
	}

	return {
		ref,
		product
	}
}
