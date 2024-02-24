import { CollectionService, DealsService, HomeService, ProductService } from '$lib/services'

export async function load({ params, parent, url }) {
	const { store, storeId, origin, sid } = await parent()
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	// let deals = {}
	// let collections = {}
	// let products = []

	query.forEach(function (value, key) {
		fl[key] = value
	})
	const home = HomeService.fetchHome({
		origin,
		storeId,
		sid
	})

	const deals = DealsService.fetchDeals({
		origin,
		storeId,
		sid
	})

	const collections = CollectionService.fetchCollections({
		origin,
		storeId,
		sid
	})

	const products = ProductService.fetchProducts({
		query: query.toString(),
		origin,
		storeId,
		sid
	})

	// const promises = [
	//
	// ]

	// await Promise.allSettled(promises).then((results) => {
	// 	const res1 = results[0]
	// 	const res2 = results[1]
	// 	const res3 = results[2]
	// 	if (res1.status === 'fulfilled') {
	// 		deals = res1.value
	// 	} else {
	// 		console.error('Error fetching deals:', res1.reason)
	// 		// redirect(307, '/auth/login')
	// 	}
	// 	if (res2.status === 'fulfilled') {
	// 		collections = res2.value
	// 	} else {
	// 		console.error('Error fetching collections:', res2.reason)
	// 	}
	// 	if (res3.status === 'fulfilled') {
	// 		products = res3.value
	// 	} else {
	// 		console.error('Error fetching products:', res3.reason)
	// 	}
	// })

	return {
		products,
		streamed: {
			home,
			deals,
			collections
		},
		currentPage,
		origin,
		query: query.toString(),
		searchData,
		sort,
		store
	}
}
