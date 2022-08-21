export async function load({ url, params, fetch, session, context }) {
let ref = url.searchParams.get('ref')

return {
	store: session.store,
	ref
}
}
