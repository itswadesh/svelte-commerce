import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchReviews = async ({origin,storeId,pid, search,sort,currentPage}:any) => {
	try {
		const	res = await getAPI(`reviews/${pid}?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchProductReviews = async ({origin,storeId,pid}:any) => {
	try {
		const	res = await getAPI(`reviews/product-reviews?pid=${pid}&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
