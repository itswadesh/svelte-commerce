import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchWishlist = async ({origin, storeId,search,sort,currentPage,server=false,sid=null}:any) => {
	try {		let	res:any={}
		if(server){
			res = await getBySid(`wishlists/my?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, sid)
		}else{
			res = await getAPI(`wishlists/my?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, origin)

		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const checkhWishlist = async ({origin, storeId,pid,vid,server=false,sid=null}:any) => {
	try {
				let	res:any={}
		if(server){
			res = await getBySid(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, sid)
	}else{
				res = await getAPI(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, origin)

		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
