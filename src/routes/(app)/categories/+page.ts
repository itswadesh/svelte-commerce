import { getAPI } from '$lib/util/api'

export async function load({ url, params, fetch, parent, setHeaders }) {
	const { store } = await parent()
	let loading = false,
		err,
		megaMenu,
		count

	try {
		loading = true
		const res = await getAPI(`categories/megamenu?megamenu=true&store=${store?.id}`)

		// console.log('zzzzzzzzzzzzzzzzzz', res)

		megaMenu = res
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	setHeaders({
		'cache-control': 'public, max-age=300'
	})

	return { megaMenu }
}
