import { HTTP_ENDPOINT } from '$lib/config'
import { gett } from '$lib/utils'

export const load = async () => {
	const fetchProducts = async () => {
		// const data = await gett(`products`)
		const res = await fetch(`${HTTP_ENDPOINT}/api/products`)
		const data = await res.json()
		return data
	}
	return {
		products: fetchProducts()
	}
}
