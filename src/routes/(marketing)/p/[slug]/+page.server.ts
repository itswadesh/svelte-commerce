import { PageService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ cookies, locals, params, url }) {
	const { slug } = params
	const { storeId } = locals

	const page = await PageService.fetchPage({
		slug,
		server: true,
		sid: cookies.get('connect.sid'),
		storeId
	})

	if (page) {
		return { page }
	}

	throw error(404, 'Blog not found')
}
