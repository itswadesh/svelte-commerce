import { ProductService } from '$lib/services'
const isServer = import.meta.env.SSR

export const prerender = false

export async function load({ url, params, parent }) {
	const { store, origin } = await parent()

	const categorySlug = params.slug
	const currentPage = +url.searchParams.get('page') || 1
	const fl = {}
	const query = url.searchParams
	const searchData = url.searchParams.get('q')
	const sort = url.searchParams.get('sort')

	query.forEach(function (value, key) {
		fl[key] = value
	})
	const { data, count, facets, pageSize, err } = await ProductService.fetchReels({
		server: isServer,
		storeId: store?.id,
		page: currentPage,
		origin
	})
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', data)
	// const products1 = [
	// 	{
	// 		name: '1 CERULEAN EMBROIDERED ORGANZA -  LUXURY LINE UNSTITCHED 4-PC',
	// 		img: 'https://litekart.b-cdn.net/litekart/reel-1.mp4'
	// 	},
	// 	{
	// 		name: '2 CERULEAN EMBROIDERED ORGANZA -  LUXURY LINE UNSTITCHED 4-PC',
	// 		img: 'https://litekart.b-cdn.net/litekart/reel-2.mp4'
	// 	},
	// 	{
	// 		name: '3 CERULEAN EMBROIDERED ORGANZA -  LUXURY LINE UNSTITCHED 4-PC',
	// 		img: 'https://litekart.b-cdn.net/litekart/reel-3.mp4'
	// 	},
	// 	{
	// 		name: '4 CERULEAN EMBROIDERED ORGANZA -  LUXURY LINE UNSTITCHED 4-PC',
	// 		img: 'https://litekart.b-cdn.net/litekart/reel-4.mp4'
	// 	},
	// 	{
	// 		name: '5 CERULEAN EMBROIDERED ORGANZA -  LUXURY LINE UNSTITCHED 4-PC',
	// 		img: 'https://litekart.b-cdn.net/litekart/reel-11.mp4'
	// 	}
	// ]
	return {
		data,
		count,
		facets,
		pageSize,
		err,
		query: query.toString(),
		searchData,
		sort,
		store,
		currentPage
	}
}
