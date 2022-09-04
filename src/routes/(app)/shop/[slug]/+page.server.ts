// This is category specific page

import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ parent, url, params, setHeaders }) {
	try {
		const { store } = await parent()

		const banners = await getAPI(`banners?pageId=${params.slug}&store=${store.id}`)
		const groupByBanners = await getAPI(`banners/group?pageId=${params.slug}&store=${store.id}`)

		if (banners || groupByBanners) {
			setHeaders({
				'cache-control': 'public, max-age=300'
			})

			return { banners, groupByBanners }
		}
	} catch (e) {
		throw error(400, e?.message || e)
	}
}
