export async function load({ url, params, parent, fetch, context }) {
	const { user } = await parent()
	return {
		store: user.store
	}
}
