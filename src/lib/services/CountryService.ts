import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchCountries = async ({origin, storeId}:any) => {
	try {
		const	res = await getAPI(`countries?limit=300&page=0&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchStates = async ({origin, storeId,countryCode}:any) => {
	try {
		const	res = await getAPI(`states?countryCode=${countryCode}&limit=300&page=0&sort=name&store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
