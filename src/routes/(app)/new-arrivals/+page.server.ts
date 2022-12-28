import { gett } from '$lib/utils'
import { page } from '$app/stores'
export async function load({ url, params, locals, fetch, parent, cookies }) {
	const { store } = locals

	let loading = false,
		err,
		newArrivals,
		products,
		productsCount,
		count

	try {
		loading = true

		const res1 = await gett(`categories/megamenu?store=${store?.id}`)

		newArrivals = res1.filter((m) => {
			return m.name === 'New Arrivals'
		})

		const res2 = await gett(`products?categories=${newArrivals[0]?._id}&store=${store?.id}`)
		products = res2?.data
		productsCount = res2?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}

	// cookies.set('cache-control', 'public, max-age=200')

	return { newArrivals, products, productsCount }
}
