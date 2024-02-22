import { error, redirect } from '@sveltejs/kit'
import { CartService, PaymentMethodService } from '$lib/services'

export const prerender = false

export async function load({ url, parent }) {
	const { me, sid, store, storeId, origin, cartId } = await parent()
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''
	let err

	try {
		const [cart, paymentMethods] = await Promise.all([
			CartService.fetchRefreshCart({
				cartId,
				origin,
				sid,
				storeId
			}),
			PaymentMethodService.fetchPaymentMethods({
				storeId,
				sid,
				origin
			})
		])

		// console.log('cart at payment options', cart);

		if (!cart?.qty) {
			redirect(307, '/cart')
		}

		return {
			cart,
			currentPage,
			err,
			paymentMethods,
			q,
			url: url.href
		}
	} catch (e) {
		// console.log('errzzzzzzzzzzzzzzzzzz', e);
		if (e.status === 307 && e.location === '/cart') {
			redirect(307, '/cart')
		} else if (e.status === 401 || e.status === 307) {
			redirect(307, `/auth/login?ref=${url?.pathname}`)
		} else {
			error(500, e?.message)
		}
	}
}
