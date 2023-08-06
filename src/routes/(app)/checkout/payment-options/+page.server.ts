import { AddressService, CartService, PaymentMethodService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me } = locals

	if (!me) {
		const redirectUrl = `${locals.store?.loginUrl || '/auth/login'}?ref=${url?.pathname}`
		throw redirect(307, redirectUrl)
	}

	const cart = await CartService.fetchRefreshCart({
		storeId: locals.store?.id,
		sid: cookies.get('connect.sid'),
		cookies
	})

	// console.log('cart.................', locals.cartId)

	locals.cart = cart

	try {
		const id = url.searchParams.get('address')
		const sid = cookies.get('connect.sid')
		const address = await AddressService.fetchAddress({
			id,
			storeId: locals.store?.id,
			cartId: locals.cartId,
			sid
		})

		const paymentMethods = await PaymentMethodService.fetchPaymentMethods({
			storeId: locals.store?.id,
			cartId: locals.cartId,
			sid
		})

		return { paymentMethods, address, addressId: id, me, cart }
	} catch (e) {
		if (e) {
			throw redirect(307, '/checkout/address')
		}
	}
}
