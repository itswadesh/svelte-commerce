import { getAPI } from '$lib/util/api'
export const prerender = false
export async function load({ url }) {
	let ads = {}
	let addressId = url.searchParams.get('id')
	let prescriptionId = url.searchParams.get('prescription')
	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = await getAPI(`addresses/${addressId}`)
	}

	return {
		ads
	}
}
