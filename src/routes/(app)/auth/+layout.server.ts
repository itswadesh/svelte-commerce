import { getBySid, gett } from '$lib/utils'
import cookie from 'cookie'
export const prerender = false

export async function load({ url, locals, request, cookies }) {
	const isHome = url.pathname === '/'
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''
	let cart, serializedCart, serializedStore
	try {
		const res = await getBySid(`carts/my?store=${locals.store?.id}`, cookies.get('sid'))

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
	// try {
	// 	const cookieStore = {
	// 		id,
	// 		domain,
	// 		logo: `/logo.svg?tr=w-auto,h-56:w-auto,h-56`,
	// 		address,
	// 		phone,
	// 		email,
	// 		websiteName,
	// 		websiteLegalName,
	// 		stripePublishableKey
	// 	}

	// 	store = cookieStore
	// 	serializedStore = cookie.serialize('store', JSON.stringify(cookieStore) || '', {
	// 		path: '/'
	// 	})
	// } catch (e) {
	// } finally {
	// }
	if (cookies) {
		cookies.set(serializedCart)
		// cookies.set(serializedStore)
	}
	return {
		url: url.href,
		currentPage,
		q,
		// me,
		// token,
		// sid,
		cart,
		store: locals.store,
		settings: locals.settings
	}
}
