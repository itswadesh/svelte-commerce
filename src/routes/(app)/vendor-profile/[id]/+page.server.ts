import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, setHeaders }) {
	const { store } = await parent()
	let vendorId = params.id

	const vendor = await gett(`vendors/${vendorId}?store=${store.id}`)
	// const vendorContents = await gett(`products?vendors=${vendorId}&store=${store.id}`)

	if (vendor) {
		// vendorContents
		return { vendor }
	}

	throw error(404, 'User not found')
}
