import { BannersService, HomeService, PageService } from '$lib/services'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ parent, url, locals, params, cookies }) {
	try {
		const { banners, categories, groupByBanner, heroBanners } = await HomeService.fetchHome({
			pageId: params.slug,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		return { banners, categories, groupByBanner, heroBanners }
	} catch (e) {
		throw error(400, e?.message || e)
	}
}
