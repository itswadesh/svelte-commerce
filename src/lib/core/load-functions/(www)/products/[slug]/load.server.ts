import type { StoreData } from '$lib/core/types'
import { checkSecuredCatalogue } from '$lib/core/utils/secure-catalogue'
import type { PageServerLoad } from '../../../../../../routes/(www)/products/[slug]/$types'

export const load: PageServerLoad = async ({ cookies, url, request, parent }) => {
	const { store }: { store: StoreData | {} } = await parent()

	if (store?.plugins?.isSecureCatalogue?.active) {
		checkSecuredCatalogue(!!cookies.get('connect.sid'), request.headers.get('referer'), url)
	}
}

