import type { Comment, CommentActionData, CommentVote, Error, Project, ReplyActionData } from '$lib/types';
import { getAPI, post } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchAutocompleteData = async ({origin, storeId,filterText}:any) => {
	try {
		const	res = await getAPI(
			`es/autocomplete?q=${filterText}&store=${storeId}`,origin
		)
		const hits = res?.data?.hits?.hits
		let data = []
		if (hits) {
			data = hits.map((h) => {
				return { name: h._source.name, slug: h._source.slug, type: h._source.type }
			})
		}
		// must return name:string, slug:string type:string
		return data || []
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const createComment = async (
	projectId: string
): Promise<CommentActionData> => {
	try {
		await post('comments',{})
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);

		const e = err as Error;

		throw error(e.status, e.data.message);
	}
};

export const updateComment = async (
): Promise<CommentActionData> => {
	try {
		await post('comments',{})
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const deleteComment = async (locals: App.Locals, id: string) => {
	try {
		await delete('comments','id')
	} catch (err) {
		if (err instanceof Error) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong while deleting your comment.');
		}
	}
};
