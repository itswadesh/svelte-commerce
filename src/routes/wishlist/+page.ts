import { GQL_myWishlist } from '$houdini'
import { redirect } from '@sveltejs/kit'

export async function load({ url, fetch, parent }) {
	const { user, store } = await parent()

	if (!user?.me) {
		throw redirect(302, `/login?ref=${url.pathname}`)
	}

	try {
		await GQL_myWishlist.fetch({
			fetch,
			variables: { store: store.id },
			settings: { cacheMs: 0 }
		})
	} catch (e) {}
	return {}
}
