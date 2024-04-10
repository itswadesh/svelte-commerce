import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'
import { shopifyInit } from '$lib/utils'

export const fetchCollections = async ({
	origin,
	query,
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


		return res || {}
	} catch (e) {
		return {}
	}
}
