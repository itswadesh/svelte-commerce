export async function load({ parent }) {
	const { user } = await parent()

	// fetchCart(token)
	return { user }
}
