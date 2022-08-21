export async function load({ url, params, fetch, paernt, context }) {
	const { user } = await parent()

	let me, err

	return { me: user.me, err }
}
