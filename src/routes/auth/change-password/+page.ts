export async function load({ url, params, parent, fetch, context }) {
	let ref = url.searchParams.get('ref')
	const { user } = await parent()

	return {
		store: user.store,
		ref
	}
}
