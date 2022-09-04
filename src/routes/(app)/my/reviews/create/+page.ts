import { getAPI } from '$lib/util/api'
export const prerender = false

export async function load({ url, params, fetch, context }) {
	let ref = url.searchParams.get('ref')
	let productId = url.searchParams.get('product')
	let product

	try {
		product = await getAPI(`products/${productId}`)
	} catch (e) {
	} finally {
	}

	return {
		ref,
		product
	}
}
