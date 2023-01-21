import { fetchAddress } from '$lib/services/AddressService'
export const prerender = false
export async function load({ url, cookies, locals }) {
	let ads = {}
	const addressId = url.searchParams.get('id')
	const prescriptionId = url.searchParams.get('prescription')
	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = await fetchAddress({
			storeId: locals.store?.id,
			addressId,
			sid: cookies.get('sid'),
			server: true
		})
	}
	return {
		ads
	}
}
