import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

export const fetchHome = async ({
	origin,
	storeId,
	pageId = 'home',
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		if (server) {
			res = await getBySid(`home?store=${storeId}&pageId=${pageId}`, sid)
		} else {
			res = await getAPI(`home?store=${storeId}&pageId=${pageId}`, origin)
		}

		const heroBanners =
			res.home?.banners?.data &&
			res.home?.banners?.data.filter((b) => {
				return b.type === 'hero'
			})
		const groupByBanners = res.groupByBanners
		const categories = res.categories
		return { groupByBanners, heroBanners, categories }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
