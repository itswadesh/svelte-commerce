
export async function load({ url, params, fetch }) {
let cart
try {
	await GQL_cart.resetCache()
	await GQL_cart.fetch({ fetch, variables: { store: store.id } })
	return {}
} catch (e) {
	throw Error(e)
}
}
