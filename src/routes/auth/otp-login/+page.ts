export async function load({ url, params, fetch, parent, context }) {
	const { user } = await parent()
	const ref = url.searchParams.get('ref')
	return {
		me: user.me,
		store: user.store,
		ref
	}
}
