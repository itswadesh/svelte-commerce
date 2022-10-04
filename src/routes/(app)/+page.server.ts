import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'
export async function load({ params, query, locals, parent, cookies }) {
	const { store } = locals
	const home = await gett(`home?store=${store?.id}`)

	if (home) {
		return { home: home }
	}
	throw error(500, 'Internal Server Error')
}
