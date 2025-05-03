import { PageService } from '$lib/core/services'
import { error } from '@sveltejs/kit'

export async function load({ parent, params, fetch }) {
	const { slug } = params
	// const { store } = await parent()
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne(slug)
		return { page }
	} catch (err: any) {
		console.error('Error fetching page: p/[slug]', err)
		error(404, 'Page not found')
	}
}

