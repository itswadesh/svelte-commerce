import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchReviews = async ({origin,storeId,pid, search,sort,currentPage,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`reviews/${pid}?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, sid)
		}else{
			res = await getAPI(`reviews/${pid}?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, origin)
		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchProductReviews = async ({origin,storeId,pid,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`reviews/product-reviews?pid=${pid}&store=${storeId}`, sid)
		}else{
			res = await getAPI(`reviews/product-reviews?pid=${pid}&store=${storeId}`, origin)
		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
