import { error } from '@sveltejs/kit'
import { del, getAPI, post } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchReels = async ({
	currentPage = 1,
	origin,
	q = '',
	sid = null,
	sort = '-updatedAt',
	storeId
}) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(
				`reels?page=${currentPage}&search=${q}&sort=${sort}&store=${storeId}`,
				sid
			)
		} else {
			res = await getAPI(
				`reels?page=${currentPage}&search=${q}&sort=${sort}&store=${storeId}`,
				origin
			)
		}

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchReel = async ({ id, origin, sid = null, storeId }) => {
	try {
		let res = {}

		if (isServer) {
			res = await getBySid(`reels/${id}?store=${storeId}`, sid)
		} else {
			res = await getAPI(`reels/${id}?store=${storeId}`, origin)
		}

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const saveReel = async ({ active, id, img, link, name, product, type, storeId }) => {
	try {
		let res = {}

		res = await post(
			`reels`,
			{
				id,
				active,
				img,
				link,
				name,
				product,
				type,
				store: storeId
			},
			origin
		)

		return res
	} catch (err) {
		error(err.status, err.message)
	}
}

export const deleteReel = async ({ id, origin, sid = null, storeId }) => {
	try {
		await del(`reels/${id}?store=${storeId}`, origin)
	} catch (err) {
		error(err.status, err.message)
	}
}
