
export async function load({ url, params, fetch }) {
let q = url.searchParams.gelAll().toString()
const page = +url.searchParams.get('page')
const products = await get(`products/es?${q}`)
const facets = products.facets.all_aggs

return {
	page,
	products,
	facets,
	query: q
}
}
