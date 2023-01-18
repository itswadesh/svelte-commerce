import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchOrders = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
		}else{
			res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
		}
		return res.data||[]
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchOrder = async ({origin, storeId,id,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`orders/${id}?store=${storeId}`, sid)
		}else{
			res = await getAPI(`orders/${id}?store=${storeId}`, origin)
		}
		return res.data||[]
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const trackOrder = async ({origin, storeId,id,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`order-tracking?order=${id}&store=${storeId}`, sid)
		}else{
			res = await getAPI(`order-tracking?order=${id}&store=${storeId}`, origin)
		}
		return res.data||[]
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
