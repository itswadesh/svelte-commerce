import { PUBLIC_HTTP_ENDPOINT } from '$env/static/public'
import { gett } from '$lib/utils'

export const load = async () => {
	const fetchProducts = async () => {
		// const data = await gett(`products`)
		const res = await fetch(`${PUBLIC_HTTP_ENDPOINT}/api/products`)
		const data = await res.json()
		console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', data.count)
		return data
	}
	return {
		products: fetchProducts()
	}
}
