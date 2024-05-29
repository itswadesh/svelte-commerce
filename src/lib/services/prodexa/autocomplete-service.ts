import { error } from '@sveltejs/kit'
import { post } from '$lib/utils/api'
import { mapProdexaAutocomplete } from './prodexa-utils'

export const fetchAutocompleteData = async ({ origin, q }: any) => {
	if (q?.length < 4) {
		return []
	}

	try {
		// search by product
		const res = await post(
			`products/search/short-product?searchValue=${q}&page=0&size=10`,
			{},
			origin
		)

		const data = res?.content?.map(mapProdexaAutocomplete)

		const search = {
			count: res?.totalElements,
			type: 'search',
			key: q
		}

		return search.count ? [search, ...data] : []
	} catch (e) {
		error(e.status, e.message)
	}
}
