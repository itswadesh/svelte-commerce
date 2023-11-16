import { CategoryService } from '$lib/services'

export async function load({ parent }) {
	const { sid, storeId, store, zip } = await parent()
	let loading = false,
		err,
		newArrivals,
		products,
		productsCount

	try {
		loading = true

		const res1 = await CategoryService.fetchMegamenuData({
			storeId,
			sid
		})

		newArrivals = res1.filter((m) => {
			return m.name === 'New Arrivals'
		})

		const res2 = await CategoryService.fetchProductsOfCategory({
			categoryId: newArrivals[0].slug,
			sid,
			storeId,
			zip
		})
		products = res2.products
		productsCount = res2.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}

	return { newArrivals, products, productsCount }
}
