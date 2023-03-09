import { error } from '@sveltejs/kit'
import { fetchProduct } from '$lib/services/ProductService'
import type { Error, Product } from '$lib/types'

export async function load({ params, parent, url, cookies, locals, request }) {
	let zip = cookies.get('zip')
	if (zip) zip = JSON.parse(zip)
	const id = url.searchParams.get('id')
	const { slug } = params
	let product: Product = {}

	try {
		product = await fetchProduct({
			slug,
			id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		if (!product) throw error(404, 'Product not found')

		// cookies.set('cache-control', 'public, max-age=200')

		return { product, deliveryDetails: zip }
	} catch (e) {
		throw error(e.status, e.message || 'Not found')
	}
}
