import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
export const prerender = false
export async function load({ url, request }) {
	let ads = {}
	const addressId = url.searchParams.get('id')
	const prescriptionId = url.searchParams.get('prescription')
	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = await gett(`addresses/${addressId}`, request.headers.get('cookie'))
	}

	return {
		ads
	}
}
