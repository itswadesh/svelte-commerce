import { HomeService } from '$lib/services'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ parent, url, locals, params, cookies }) {
	try {
		const { banners, html, groupByBanner, heroBanners } = await HomeService.fetchHome({
			pageId: params.slug,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		return { banners, html, groupByBanner, heroBanners }
	} catch (e) {
		throw error(400, e?.message || e)
	}
}
