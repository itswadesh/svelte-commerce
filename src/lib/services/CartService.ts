import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchCartData = async ({origin, storeId}:any) => {
	try {
		const	res = await getAPI(`cart?store=${storeId}`, origin)
		return res||{};
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};