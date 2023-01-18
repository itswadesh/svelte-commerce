import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchWishlist = async ({origin, storeId,search,sort,currentPage}:any) => {
	try {
		const	res = await getAPI(`wishlists/my?search=${search}&sort=${sort}&page=${currentPage}&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const checkhWishlist = async ({origin, storeId,pid,vid}:any) => {
	try {
		const	res = await getAPI(`wishlists/check?product=${pid}&variant=${vid}&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
