import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchCartData = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
			let	res:any={}
		if(server){
			res = await getBySid(`cart?store=${storeId}`, sid)
	}else{
				res = await getAPI(`cart?store=${storeId}`, origin)
		}
		return res||{};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const refreshCartData = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
			let	res:any={}
		if(server){
			res = await getBySid(`carts/refresh-cart?store=${storeId}`, sid)
	}else{
				res = await getAPI(`carts/refresh-cart?store=${storeId}`, origin)
		}
		return res||{};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};