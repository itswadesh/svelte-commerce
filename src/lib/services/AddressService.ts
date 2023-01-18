import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { getBySid, gett } from '$lib/utils/server';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchAddresses = async ({origin, storeId}:any) => {
	try {
		const	res = await getAPI(`addresses/my?store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchAddress = async ({sid,origin, storeId,id}:any) => {
	try {
		const	res = await getBySid(`addresses/${id}`, sid)
		return res||{};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
