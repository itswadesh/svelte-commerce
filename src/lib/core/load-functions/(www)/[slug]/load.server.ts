import { MeilisearchService } from '$lib/core/services'
import type { StoreData } from '$lib/core/types'
import { checkSecuredCatalogue } from '$lib/core/utils/secure-catalogue'
import type { PageServerLoad } from '../../../../../routes/(www)/[slug]/$types'

export const load: PageServerLoad = async ({ cookies, url, params, request, parent, fetch }) => {
	const { store }: { store: StoreData | {} } = await parent()

	if (store?.plugins?.isSecureCatalogue?.active) {
		checkSecuredCatalogue(!!cookies.get('connect.sid'), request.headers.get('referer'), url)
	}

	try {
		const { slug } = params
		const meilisearchService = new MeilisearchService(fetch)
		const res = await meilisearchService.search({
			query: url?.searchParams?.get('search') || '',
			categories: slug,
			price: url?.searchParams?.get('price') || '',
			tags: url?.searchParams?.get('tags') || '',
			originCountry: url?.searchParams?.get('originCountry') || '',
			keywords: url?.searchParams?.get('keywords') || '',
			page: Number(url?.searchParams?.get('page')) || 1
		})
		return { page: res }
	} catch (e) {
		return { page: {} }
	}
}

