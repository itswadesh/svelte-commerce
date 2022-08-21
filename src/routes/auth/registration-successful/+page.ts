export async function load({ url, params, fetch, parent, context }) {
	const { store } = await parent()
	return {
		store: store
	}
}
