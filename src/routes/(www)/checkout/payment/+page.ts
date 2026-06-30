import { PageService } from '$lib/core/services/index.js'
import type { PageLoad } from './$types.js'

export const load: PageLoad = async ({ parent, fetch }) => {
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne('checkout_payment')
		return { page }
	} catch (error: any) {
		console.error('Error fetching page: contact-us', error)
		return { page: {}, error: error.message || 'An error occurred' }
	}
}
