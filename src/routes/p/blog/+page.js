export async function load({ url, params, fetch, session, context }) {
let search, sort, query, blogs, err, page, count
try {
	search = url.searchParams.get('search')
	page = url.searchParams.get('page') || 1
	sort = url.searchParams.get('sort')
	query = url.searchParams.toString()
	GQL_blogs.fetch({ fetch, variables: { search, sort, page } })
	// count = res?.count
	// console.log(res)
} catch (e) {
	err = e
	toast(e, 'error')
} finally {
}
return { err, blogs, page, count }
}
