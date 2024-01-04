import { HomeService } from '$lib/services'
export const prerender = false
const isServer = import.meta.env.SSR

export async function load({ parent, params }) {
	const { origin, storeId, store, sid } = await parent()

	return HomeService.fetchHome({
		pageId: params.slug,
		storeId,
		server: isServer,
		origin,
		sid
	})
}
