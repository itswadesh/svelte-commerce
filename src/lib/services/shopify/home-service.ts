import { error } from '@sveltejs/kit'
import { getShopifyApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { shopifyInit } from 'lib/utils'

export const fetchHome = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}

		res = await shopifyInit({
			query: `{
				shop {
             name
             id
            description
        }
			}
			`,
			variables: {}
		})

		// console.log('res', res)

		return res || {}
	} catch (e) {
		error(e.status, e.data?.message || e.message)
	}
}
