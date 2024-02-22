import { error } from '@sveltejs/kit'
import { PageService } from '$lib/services'

export async function load({ parent, params }) {
	const { slug } = params
	const { storeId, sid, origin } = await parent()

	const page = await PageService.fetchPage({
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
