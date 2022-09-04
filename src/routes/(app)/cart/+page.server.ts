import { getAPI, post } from '$lib/util/api'
import { error, redirect } from '@sveltejs/kit'
// import Cookie from 'cookie-universal'
import cookie from 'cookie'
export async function load({ url, request, setHeaders }) {
	// console.log('Load of cart..........')
	// const cookies = Cookie()
	let cart,
		loading = false
	try {
		loading = true
		const res = await getAPI('carts/refresh-cart', request.headers)

		
		if (res) {
			const cookieCart = {
				items: res?.items,
				qty: +res?.qty,
				tax: +res?.tax,
				subtotal: +res?.subtotal,
				total: +res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}
			
			const str = cookie.serialize('cart', JSON.stringify(cookieCart), { path: '/' })
			
			setHeaders({ 'set-cookie': str })
			// await cookies.set('cart', cookieCart, { path: '/' })
			
			// console.log('zzzzzzzzzzzzzzzzzzcookieCart', cookieCart);

			cart = cookieCart
		}
	} catch (e) {
		console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', e)
		if (e?.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
		throw error(400, e?.message || e)
	} finally {
		loading = false
	}

	setHeaders({
		'cache-control': 'public, max-age=200'
	})

	return { loadingCart: loading, cart }
}
