import { getAPI } from '$lib/util/api'

export async function load({ url, params, fetch, parent, cookies }) {
	const { store } = await parent()
	let loading = false,
		err,
		megaMenu,
		count

	return { loading }
}
