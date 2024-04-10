import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchBanners = async ({
	origin,
	pageId,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await shopifyInit({
			query: `{
				products(first: 10) {
					edges {
						node {
							id
							title
							tags
						}
					}
				}
			}
			`,
			variables: {}
		})

		// console.log('res', res);

		// return res || {}
		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}

export const fetchBannersGroup = async ({
	origin,
	storeId,
	pageId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await getShopifyApi(`customers/me`, {}, sid)

		return res.data || []
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
