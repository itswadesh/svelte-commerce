import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import { getBigCommerceApi, getBySid, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchReviews = async ({
	origin,
	storeId,
	pid,
	search,
	sort,
	currentPage,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`reviews/${pid}?search=${
							search || ''
						}&sort=${sort}&page=${currentPage}&store=${storeId}`,
						sid
					)
				} else {
					res = await getAPI(
						`reviews/${pid}?search=${
							search || ''
						}&sort=${sort}&page=${currentPage}&store=${storeId}`,
						origin
					)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`reviews/${pid}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`reviews/${pid}`, {}, sid)
				break
		}
		return res?.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchProductReviews = async ({
	origin,
	storeId,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`reviews/product-reviews?pid=${pid}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`reviews/product-reviews?pid=${pid}&store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`reviews/product-reviews?pid=${pid}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`reviews/product-reviews?pid=${pid}`, {}, sid)
				break
		}
		return res?.data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
