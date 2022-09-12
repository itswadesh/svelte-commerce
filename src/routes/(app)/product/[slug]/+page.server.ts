import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, setHeaders }) {
	const { store } = await parent()
	const { slug } = params
	let product = null
	let relatedProducts = []

	try {
		product = await getAPI(`products/${slug}`)
		relatedProducts = await getAPI(
			`products/frequently-bought-together?store=${store?.id}&groupId=${product?.groupId}`
		)
		if (!product) throw error(404, 'Product not found')
		setHeaders({
			'cache-control': 'public, max-age=300'
		})
	} catch (e) {
	} finally {
		return { product, relatedProducts }
	}
}
