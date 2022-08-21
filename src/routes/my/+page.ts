export async function load({ url, params, fetch, parent, context }) {
	let search, sort, query, banners, errors, currentPage, count, me
	const { user } = await parent()

	return { me: user.me }
}
