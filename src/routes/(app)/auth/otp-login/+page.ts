export const prerender = false
export async function load({ url, params, fetch, parent, context }) {
	const ref = url.searchParams.get('ref')
	const { store, me } = await parent()
	return {
		me: me,
		store: store,
		ref
	}
}
