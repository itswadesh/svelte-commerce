import { PageService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../routes/(legal)/about-us/$types'

export const load: PageServerLoad = async ({ parent, fetch }) => {
	// const { store } = await parent()
	// console.log('🚀 ~ file: +page.server.ts ~ load ~ store:', store?.id)
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne('about-us')
		return { page }
	} catch (error: any) {
		console.error('Error fetching page: about-us:', error)
		return { page: {}, error: error.message || 'An error occurred' }
	}
}

