import { fetchMyCart } from '$lib/services/CartService'
import cookie from 'cookie'
export const prerender = false

export async function load({ url, locals, request, cookies }) {
	const isHome = url.pathname === '/'
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''
	let cart, serializedCart, serializedStore
	try {
		const res: any = fetchMyCart({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('sid')
		})

		if (res) {
			const cookieCart = {
				items: res?.items,
				qty: res?.qty,
				tax: res?.tax,
				subtotal: res?.subtotal,
				total: res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				savings: res?.savings,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}
			cart = cookieCart
			serializedCart = cookie.serialize('cart', JSON.stringify(cookieCart) || '', {
				path: '/'
			})
		}
	} catch (e) {
	} finally {
	}

	if (cookies) {
		// cookies.set(serializedCart)
	}
	return {
		url: url.href,
		currentPage,
		q,
		cart,
		store: locals.store,
		settings: locals.settings
	}
}
