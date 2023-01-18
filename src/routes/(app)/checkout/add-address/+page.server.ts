import { fetchAddress } from '$lib/services/AddressService'
export const prerender = false
export async function load({ url, request }) {
	let ads = {}
	const addressId = url.searchParams.get('id')
	const prescriptionId = url.searchParams.get('prescription')
	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = await fetchAddress({addressId,sid: request.cookies.get('sid')})
	}
	return {
		ads
	}
}
