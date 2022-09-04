import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, setHeaders }) {
	const { store } = await parent()
	const { slug } = params

	const product = await getAPI(`products/${slug}`)
	const relatedProducts = await getAPI(`products/frequently-bought-together?store=${store?.id}&groupId=${product?.groupId}`)

	if (product) {
		setHeaders({
			'cache-control': 'public, max-age=300'
		})
		return { product, relatedProducts }
	}

	throw error(404, 'Product not found')
}
