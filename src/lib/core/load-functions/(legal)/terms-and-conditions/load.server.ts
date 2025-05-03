import { PageService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../routes/(legal)/terms-and-conditions/$types'

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne('terms-and-conditions')
		return { page }
	} catch (error: any) {
		return { page: {}, error: error.message || 'An error occurred' }
	}
}

