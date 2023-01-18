import type {  Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchFooterCategories = async ({origin, storeId}:any) => {
	try {
		let data: [];
			data = await getAPI(
			`categories?store=${storeId}&megamenu=true&limit=6&page=0&level=0`,origin
		)
		// must return link:string, slug:string(optional) name:string, new:boolean
		return data;
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchAllCategories = async ({origin, storeId}:any) => {
	try {
		let data: [];
			data = await getAPI(`categories?store=${storeId}`, origin)
		// must return link:string, slug:string(optional) name:string, new:boolean
		return data;
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchMegamenuData = async ({origin, storeId}:any) => {
	try {
		let data: [];
			data = await getAPI(`categories/megamenu?megamenu=true&store=${storeId}`, origin)
		// must return link:string, slug:string(optional) name:string, new:boolean
		return data;
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
