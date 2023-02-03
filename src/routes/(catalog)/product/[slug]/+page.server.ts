import type Product from '$lib/components/SEO/Product.svelte'
import { fetchProduct } from '$lib/services/ProductService'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, url, cookies, locals, request }) {
	let zip = cookies.get('zip')
	if (zip) zip = JSON.parse(zip)
	const id = url.searchParams.get('id')
	const { slug } = params
	let product: Product | null = null

	try {
		product = await fetchProduct({ slug, id, server: true })
		if (!product) throw error(404, 'Product not found')
		// cookies.set('cache-control', 'public, max-age=200')
		return { product, deliveryDetails: zip }
	} catch (e) {
		throw error(e.status, e.message || 'Not found')
	}
}

// export const actions = {
// 	default: async ({ request, locals }) => {
// 		const formData = Object.fromEntries(await request.formData())
// 		try {
// 			const data = await gett(`pincodes/${formData.zip}`, request.headers.get('cookie'))
// 			return {
// 				data: data
// 			}
// 		} catch (e) {
// 			return {}
// 		}
// 	}
// }
