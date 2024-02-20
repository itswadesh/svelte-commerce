import { error } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'

export async function load({ parent, params }) {
	const { slug } = params
	const { storeId, sid, origin } = await parent()

	const page = await services.PageService.fetchPage({
		slug,
		sid,
		origin,
		storeId
	})

	if (page) {
		return { page }
	}

	error(404, 'Blog not found')
}