export async function load({ parent }) {
	const { store } = await parent()
	return {
		store: store
	}
}
