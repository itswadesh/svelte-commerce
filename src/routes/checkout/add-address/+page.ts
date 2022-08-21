import { GQL_address } from '$houdini'

export async function load({ url, params, fetch, context }) {
	let ads, err
	let addressId = url.searchParams.get('id')

	if (addressId === 'new') {
		ads = { id: 'new' }
	} else {
		ads = (
			await GQL_address.fetch({ fetch, variables: { id: addressId }, settings: { cacheMs: 0 } })
		).data?.address
	}
	return { err, ads }
}
