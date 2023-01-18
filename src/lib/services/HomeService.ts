import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchHome = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`home?store=${storeId}`, sid)
		}else{
			res = await getAPI(`home?store=${storeId}`, origin)
		}
		return res||{}
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
