import { CategoryService } from '$lib/services'

export async function load({ locals, cookies }) {
	let loading = false,
		err,
		newArrivals,
		products,
		productsCount,
		count

	try {
		loading = true

		const res1 = await CategoryService.fetchMegamenuData({
			storeId: locals.storeId,
			server: true,
			sid: cookies.get('connect.sid')
		})

		newArrivals = res1.filter((m: any) => {
			return m.name === 'New Arrivals'
		})

		const res2 = await CategoryService.fetchProductsOfCategory({
			categoryId: newArrivals[0].slug,
			server: true,
			sid: cookies.get('connect.sid'),
			storeId: locals.storeId,
			zip: cookies.get('zip')
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
