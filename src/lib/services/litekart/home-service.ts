import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchHome = async ({
	isCors = false,
	origin,
	pageId = 'home',
	server = false,
	sid = null,
	storeId,
}: any) => {
	try {
		let categories = {}
		let res: any = {}

		if (isServer || isCors) {
			res = await getBySid(`home?store=${storeId}&pageId=${pageId}`, sid)
		} else {
			res = await getAPI(`home?store=${storeId}&pageId=${pageId}`, origin)
		}

		if (res?.categories?.data?.length) {
			categories = res?.categories?.data
		}

		return {
			brands: res?.brands,
			categories,
			html: res?.html,
			page: res?.page,
			trending: res?.trending,
			youMayLike: res?.youMayLike
		}
	} catch (e) {
		error(e.status, e.data?.message || e.message || e);
	}
}

export const fetchCategoriesProducts = async ({
	categories,
	origin,
	server = false,
	sid = null,
	storeId,
}) => {
	let categoriesProducts

	if (isServer) {
		categoriesProducts = await getBySid(
			`es/products?categories=${categories}&sort=-updatedAt&limit=20&store=${storeId}`,
			sid
		)
	} else {
		categoriesProducts = await getAPI(
			`es/products?categories=${categories}&sort=-updatedAt&limit=20&store=${storeId}`,
			origin
		)
	}

	return categoriesProducts
}
