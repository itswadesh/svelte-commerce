export const prerender = false
export async function load({ url, params, fetch, locals, parent, context }) {
	const ref = url.searchParams.get('ref')
	const { store, me } = locals
	return {
		me: me,
		store: store,
		ref
	}
}
