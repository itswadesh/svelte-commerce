import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid, gett } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchAddresses = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`addresses/my?store=${storeId}`, sid)
		}else{
			res = await getAPI(`addresses/my?store=${storeId}`, origin)
		}
		const selectedAddress = res?.data[0]?._id
		return {myAddresses:res.data||[],selectedAddress}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchAddress = async ({origin, storeId,server=false,sid=null,id}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`addresses/${id}`, sid)
		}else{
			res = await getAPI(`addresses/${id}`, origin)
		}
		return res||{};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
