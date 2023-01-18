import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchBlogs = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`blogs?store${storeId}`, sid)
		}else{
			res = await getAPI(`blogs?store${storeId}`, origin)
		}
		return res.data||{}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchLatestBlogs = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, sid)
		}else{
			res = await getAPI(`blogs?sort=-updatedAt&limit=10&store=${storeId}`, origin)
		}
		return res.data||{}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchBlog = async ({origin,id, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`blogs/${id}`, sid)
		}else{
			res = await getAPI(`blogs/${id}`, origin)
		}
		return res.data||{}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
