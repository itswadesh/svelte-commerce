import { getMedusajsApi } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchAutocompleteData = async ({ origin, storeId, q }: any) => {
	try {
		let res: any = {}
		let data = []

		res = await getMedusajsApi(`autocomplete`, {})

		// must return name:string, slug:string type:string
		return data || []
	} catch (e) {
		error(e.status, e.message)
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
