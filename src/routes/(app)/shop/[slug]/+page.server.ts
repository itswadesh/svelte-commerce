// This is category specific page

import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
export const prerender = false

export async function load({ parent, url, locals, params, cookies }) {
	try {
		const { store } = locals

		const banners = await gett(`banners?pageId=${params.slug}&store=${store.id}`)
		const groupByBanners = await gett(`banners/group?pageId=${params.slug}&store=${store.id}`)

		if (banners || groupByBanners) {
			// cookies.set('cache-control', 'public, max-age=200')

			return { banners, groupByBanners }
		}
	} catch (e) {
		throw error(400, e?.message || e)
	}
}
