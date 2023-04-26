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
		let banners = []
		let categories = {}
		let groupByBanner = {}
		let heroBanners = []
		let res: any = {}

		if (server) {
			res = await getBySid(`home?store=${storeId}&pageId=${pageId}`, sid)
		} else {
			res = await getAPI(`home?store=${storeId}&pageId=${pageId}`, origin)
		}

		if (res?.banners?.data?.length) {
			banners = res?.banners?.data

			heroBanners =
				res?.banners?.data &&
				res?.banners?.data.filter((b) => {
					return b.type === 'hero'
				})
		}

		if (res?.groupByBanner?.length) {
			groupByBanner = res?.groupByBanner
		}

		if (res?.categories?.data?.length) {
			categories = res?.categories?.data
		}

		return {
			banners,
			brands: res?.brands,
			categories,
			html: res?.html,
			groupByBanner,
			heroBanners,
			trending: res?.trending,
			youMayLike: res?.youMayLike
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
export const fetchInitialPendants = async ({ origin, storeId, server = false, sid = null }) => {
	let initialPendants
	if (server) {
		initialPendants = await getBySid(
			`es/products?categories=pendants-initial-pendants-en-en&sort=-updatedAt&limit=20&store=${storeId}`,
			sid
		)
	} else {
		initialPendants = await getAPI(
			`es/products?categories=pendants-initial-pendants-en-en&sort=-updatedAt&limit=20&store=${storeId}`,
			origin
		)
	}
	return initialPendants
}
