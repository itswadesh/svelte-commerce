import { redirect } from '@sveltejs/kit'
import { getBySid } from '$lib/utils/server'
import { fetchAddress } from '$lib/services/AddressService'
import { fetchPaymentMethods } from '$lib/services/PaymentMethodService'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me } = locals
	if (!me) {
		const redirectUrl = `${locals.store?.loginUrl || '/auth/login'}?ref=${url?.pathname}`
		throw redirect(307, redirectUrl)
	}
	const cartRes = await getBySid(`carts/refresh-cart?store=${locals.store?.id}`, cookies.get('sid'))
	const cart = {
		cartId: cartRes.cart_id,
		items: cartRes.items,
		qty: cartRes.qty,
		tax: cartRes.tax,
		subtotal: cartRes.subtotal,
		total: cartRes.total,
		currencySymbol: cartRes.currencySymbol,
		discount: cartRes.discount,
		savings: cartRes.savings,
		selfTakeout: cartRes.selfTakeout,
		shipping: cartRes.shipping,
		unavailableItems: cartRes.unavailableItems,
		formattedAmount: cartRes.formattedAmount
	}
	locals.cart = cart
	try {
		const addressId = url.searchParams.get('address')

		const address = await fetchAddress({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('sid')
		})
		const paymentMethods = await fetchPaymentMethods({ storeId: locals.store.id, server: true })
		return { paymentMethods, address, addressId, me, cart }
	} catch (e) {
		if (e) {
			throw redirect(307, '/checkout/address')
		}
	}
}
