import { CategoryService } from '$lib/services'

export const prerender = false
const isServer = import.meta.env.SSR

export async function load({ url, params, parent, setHeaders }) {
	const { store, storeId, origin, sid } = await parent()

	const categorySlug = 'mobile-cover'

	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})

	let category = {}
	let megamenu = {}

	const promises = [
		CategoryService.fetchCategory({
			id: categorySlug,
			sid,
			storeId,
			origin
		}),
		CategoryService.fetchMegamenuData({
			sid,
			storeId,
			origin
		})
	]

	await Promise.allSettled(promises).then((results) => {
		const res1 = results[0]
		const res2 = results[1]
		if (res1.status === 'fulfilled') {
			category = res1.value
		} else {
			console.error('Error fetching deals:', res1.reason)
			// redirect(307, '/auth/login')
		}
		if (res2.status === 'fulfilled') {
			megamenu = res2.value
		} else {
			console.error('Error fetching collections:', res2.reason)
		}
	})

	return {
		category,
		megamenu,
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
