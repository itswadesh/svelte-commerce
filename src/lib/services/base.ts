import { error, redirect } from '@sveltejs/kit';

export const deleteRecord = async (
	locals: App.Locals,
	collectionName: string,
	recordId: string,
	redirectTo: string
) => {
	try {
		// await delete(collectionName, recordId)
	} catch (e) {
		console.log('Error:', e);
		throw error(e.status, e.data.message);
	}
	throw redirect(303, redirectTo);
};
