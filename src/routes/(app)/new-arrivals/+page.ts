import { getAPI } from '$lib/util/api'

export async function load({ url, params, fetch, parent, setHeaders }) {
	const { store } = await parent()

	let loading = false,
		err,
		newArrivals,
		products,
		productsCount,
		count

	try {
		loading = true

		const res1 = await getAPI(`categories/megamenu?store=${store?.id}`)

		newArrivals = res1.filter((m) => {
			return m.name === 'New Arrivals'
		})

		const res2 = await getAPI(`products?categories=${newArrivals[0]?._id}&store=${store?.id}`)
		products = res2?.data
		productsCount = res2?.count

		// console.log('zzzzzzzzzzzzzzzzzz', res1)
		// console.log('zzzzzzzzzzzzzzzzzz', res2)
	} catch (e) {
		err = e
	} finally {
		loading = false
	}

	setHeaders({
		'cache-control': 'public, max-age=300'
	})

	return { newArrivals, products, productsCount }
}
