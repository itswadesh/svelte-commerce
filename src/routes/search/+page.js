import Cookie from 'cookie-universal'
const cookies = Cookie()

export async function load({ url, params, fetch, context, cookie }) {
	let err, count, products, facets, currentLocation
	let currentPage = url.searchParams.get('page') || 1
	let sort = url.searchParams.get('sort')
	let searchData = url.searchParams.get('q')
	let location = url.searchParams.get('location')
	let query = url.searchParams

	const geo = cookies.get('geo') // when navigated from home page vs this page refreshed

	// url.searchParams.set('lat', geo?.lat)
	// url.searchParams.set('lng', geo?.lng)
	url.searchParams.delete('location')
	currentLocation = geo?.selectedPrediction
	try {
		const res = await get(`products/es?${query.toString()}`)
		products = res?.data
		count = +res?.count
		facets = res?.facets.all_aggs
		err = !products ? 'No result found' : null
	} catch (e) {
	} finally {
	}
	return {
		err,
		count,
		products,
		url,
		currentPage,
		sort,
		facets,
		query,
		searchData,
		currentLocation
	}
}
