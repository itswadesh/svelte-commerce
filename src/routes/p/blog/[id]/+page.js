export async function load({ url, params, fetch, session, context }) {
let blog, err
try {
	await GQL_blog.fetch({ fetch, variables: { id: params.id } })
	// console.log(res)
} catch (e) {
	err = e
	toast(e, 'error')
} finally {
}
return { err }
}
