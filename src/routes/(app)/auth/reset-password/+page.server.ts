export async function load({ url }) {
	const id = await url.searchParams.get('id')
	const token = await url.searchParams.get('token')
	return { id, token }
}
