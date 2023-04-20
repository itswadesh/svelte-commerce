import { HomeService } from '$lib/services'
export const prerender = false
const isServer = import.meta.env.SSR

export async function load({ parent, params }) {
	const { origin, store, sid } = await parent()

	return HomeService.fetchHome({
		pageId: params.slug,
		storeId: store?.id,
		server: isServer,
		origin,
		sid
	})
}
