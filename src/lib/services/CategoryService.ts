import type {  Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
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

export const fetchCategory = async ({origin, id,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`category/${id}`, sid)
		}else{
			res = await getAPI(`category/${id}`, origin)
		}
		return res||{}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchAllCategories = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`categories?store=${storeId}`, sid)
		}else{
			res = await getAPI(`categories?store=${storeId}`, origin)
		}
		const products = res?.data || []
		const productsCount = res?.count
		const currentPage = res?.page
		const facets = res?.facets?.all_aggs
		const err = !products ? 'No result Not Found' : null
		// must return link:string, slug:string(optional) name:string, new:boolean
		return {products, productsCount,currentPage,facets,err};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchMegamenuData = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let data: [];
		if(server){
			data = await getBySid(`categories/megamenu?megamenu=true&store=${storeId}`, sid)
		}else{
			data = await getAPI(`categories/megamenu?megamenu=true&store=${storeId}`, origin)
		}
		// must return link:string, slug:string(optional) name:string, new:boolean
		return data;
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
