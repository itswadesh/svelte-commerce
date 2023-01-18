import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchCoupons = async ({origin, storeId}:any) => {
	try {
		const	res = await getAPI(`coupons?store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
