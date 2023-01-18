import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchCountries = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
				let	res:any={}
		if(server){
			res = await getBySid(`countries?limit=300&page=0&store=${storeId}`, sid)
		}else{
			res = await getAPI(`countries?limit=300&page=0&store=${storeId}`, origin)

		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchStates = async ({origin, storeId,countryCode,server=false,sid=null}:any) => {
	try {
				let	res:any={}
		if(server){
			res = await getBySid(`states?countryCode=${countryCode}&limit=300&page=0&sort=name&store=${storeId}`, sid)
		}else{
			res = await getAPI(`states?countryCode=${countryCode}&limit=300&page=0&sort=name&store=${storeId}`, origin)
		}
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
