import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'
export async function load({ params, query, parent, setHeaders }) {
	const { store } = await parent()
	const home = await getAPI(`home?store=${store?.id}`)
	setHeaders({
		'cache-control': 'public, max-age=300'
	})

	if (home) {
		return { home: home }
	}
	throw error(500, 'Internal Server Error')
}
