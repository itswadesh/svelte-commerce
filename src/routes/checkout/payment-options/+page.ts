export async function load({ url, params, fetch, session, context }) {
let addressId = url.searchParams.get('address')
let prescriptionId = url.searchParams.get('prescription')
let loading, err, address, prescription, paymentMethods

try {
	loading = true

	paymentMethods = (await GQL_paymentMethods.fetch({ fetch, variables: { store: store?.id } }))
		.data?.paymentMethods.data

	address = (
		await GQL_address.fetch({
			fetch,
			variables: {
				id: addressId
			}
		})
	).data?.address
} catch (e) {
	err = e
} finally {
	loading = false
}
return { loading, address, err, paymentMethods, prescription, addressId }
}
