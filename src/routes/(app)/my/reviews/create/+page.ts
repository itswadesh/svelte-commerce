import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
export const prerender = false

export async function load({ url, params, fetch, context }) {
	const ref = url.searchParams.get('ref')
	const productId = url.searchParams.get('product')
	let product

	try {
		product = await gett(`products/${productId}`)
	} catch (e) {
	} finally {
	}

	return {
		ref,
		product
	}
}
