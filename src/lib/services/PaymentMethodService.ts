import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchPaymentMethods = async ({origin, storeId,server=false,sid=null}:any) => {
	try {
		let	res:any={}
		if(server){
			res = await getBySid(`payment-methods?store=${storeId}&active=true`, sid)
		}else{
			res = await getAPI(`payment-methods?store=${storeId}&active=true`, origin)
		}
		return res.data||[]
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
