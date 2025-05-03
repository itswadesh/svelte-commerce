import { PageService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../routes/(legal)/refund-policy/$types'

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne('refund-policy')
		return { page }
	} catch (error: any) {
		console.error('Error fetching page: refund-policy', error)
		return { page: {}, error: error.message || 'An error occurred' }
	}
}

