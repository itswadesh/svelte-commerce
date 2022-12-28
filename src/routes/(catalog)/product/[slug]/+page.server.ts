import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, cookies, locals, request }) {
	// const ck = request.headers.get('cookie')
	// const c = cookie.parse(ck || '')
	let zip = cookies.get('zip')
	if (zip) zip = JSON.parse(zip)

	const { slug } = params
	let product = null

	try {
		product = await gett(`products/${slug}`)

		if (!product) throw error(404, 'Product not found')
		// cookies.set('cache-control', 'public, max-age=200')
		return { product, deliveryDetails: zip }
	} catch (e) {
		throw error(e.status, e.message)
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
