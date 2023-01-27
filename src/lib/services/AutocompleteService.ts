import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI, post } from '$lib/utils/api'
import { getBigCommerceApi, getWooCommerceApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchAutocompleteData = async ({ origin, storeId, q }: any) => {
	try {
		let res: any = {}
		let data = []
		switch (provider) {
			case 'litekart':
				let filterText = `es/autocomplete?store=${storeId}&q=`
				if (!!q && q !== 'undefined' && q !== 'null' && q !== '') {
					filterText = `es/autocomplete?store=${storeId}&q=${q}`
				}
				res = await getAPI(filterText, origin)
				const hits = res?.data?.hits?.hits
				if (hits) {
					data = hits.map((h) => {
						return { name: h._source.name, slug: h._source.slug, type: h._source.type }
					})
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`es/autocomplete?q=${filterText}&store=${storeId}`, {})
				data = res
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`es/autocomplete?q=${filterText}&store=${storeId}`, {})
				break
		}
		// must return name:string, slug:string type:string
		return data || []
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

// export const createComment = async (
// 	projectId: string
// ): Promise<CommentActionData> => {
// 	try {
// 		await post('comments',{})
// 		return {
// 			success: true
// 		};
// 	} catch (err) {
// 		console.log('Error:', err);

// 		const e = err as Error;

// 		throw error(e.status, e.data.message);
// 	}
// };

// export const updateComment = async (
// ): Promise<CommentActionData> => {
// 	try {
// 		await post('comments',{})
// 		return {
// 			success: true
// 		};
// 	} catch (err) {
// 		console.log('Error:', err);
// 		const e = err as Error;
// 		throw error(e.status, e.data.message);
// 	}
// };

// export const deleteComment = async (locals: App.Locals, id: string) => {
// 	try {
// 		await delete('comments','id')
// 	} catch (err) {
// 		if (err instanceof Error) {
// 			throw error(err.status, err.data.message);
// 		} else {
// 			throw error(500, 'Something went wrong while deleting your comment.');
// 		}
// 	}
// };
