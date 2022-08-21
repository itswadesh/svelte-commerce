export async function load({ url, params, fetch, user, context }) {
	const ref = url.searchParams.get('ref')
	return {
		me: user.me,
		store: user.store,
		ref
	}
}
