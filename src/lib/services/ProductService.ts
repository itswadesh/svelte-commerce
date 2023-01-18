import type { Error } from '$lib/types';
import { getAPI } from '$lib/utils/api';
import { serializeNonPOJOs } from '$lib/utils/validations';
import { error } from '@sveltejs/kit';

export const fetchProducts = async ({origin, storeId}:any) => {
	try {
		const	res = await getAPI(`products?store=${storeId}`, origin)
		return res?.data||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchNextPageProducts = async ({origin, storeId,categorySlug}:any) => {
	try {
		const	res = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}`, origin)
		const nextPageData = res?.data?.map((p) => {
			const p1 = { ...p._source }
			p1.id = p._id
			return p1
		})
		return nextPageData||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};

export const fetchRelatedProducts = async ({origin, storeId,categorySlug,pid}:any) => {
	try {
		const	relatedProductsRes = await getAPI(`es/products?categories=${categorySlug}&store=${storeId}`, origin)
		const relatedProducts = relatedProductsRes?.data.filter((p) => {
			return p._id !== pid
		})
		return relatedProducts||[];
	} catch (err) {
		const e = err as Error;
		throw error(e.status, e.data.message);
	}
};
