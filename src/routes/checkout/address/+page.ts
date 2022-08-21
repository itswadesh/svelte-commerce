import { redirect } from '@sveltejs/kit';

export async function load({ url, params, fetch, session, context }) {
// console.log('url', url)
let loading, err, myAddresses, selectedAddress
let prescriptionId = url.searchParams.get('prescription')

// const me = (await GQL_me.fetch({ fetch, settings: { policy: 'cache-and-network' } })).data?.me
if (!session.me) {
	throw redirect(302, `${session.loginUrl}?ref=${url.pathname}`);
}

try {
	loading = true
	const myAddressesRes = await GQL_myAddresses.fetch({ fetch, settings: { cacheMs: 0 } })
	if (myAddressesRes.errors) err = myAddressesRes.errors[0].message
	myAddresses = myAddressesRes.data?.myAddresses
	selectedAddress = myAddresses?.data[0]?.id
	// console.log('selectedAddress = ', selectedAddress)
} catch (e) {
	err = e
} finally {
	loading = false
}

return { loading, myAddresses, err, prescriptionId, selectedAddress }
}
