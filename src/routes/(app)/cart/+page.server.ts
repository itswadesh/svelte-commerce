import { CartService, WishlistService } from '$lib/services'
import { error, fail, redirect } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies, depends }) => {
	const { store, storeId, origin } = locals
	depends('cart:my')
	let loading = false
	let cart = locals.cart

	try {
		loading = true

		const cartId = cookies.get('cartId')
		// const cartQty = cookies.get('cartQty')
		const sid = cookies.get('connect.sid')

		if (sid) {
			const res = await services.CartService.fetchRefreshCart({
				cartId,
				origin: origin,
				sid,
				storeId
			})

			if (res) {
				cart = {
					cartId: res?.cart_id,
					currencySymbol: res?.currencySymbol,
					discount: res?.discount,
					formattedAmount: res?.formattedAmount,
					items: res?.items,
					qty: res?.qty,
					savings: res?.savings,
					selfTakeout: res?.selfTakeout,
					shipping: res?.shipping,
					subtotal: +res?.subtotal,
					tax: +res?.tax,
					total: +res?.total,
					unavailableItems: res?.unavailableItems
				}
			}
		}
	} catch (e) {
		if (e?.status === 401) {
			redirect(307, `/auth/login?ref=${url?.pathname}`)
		}
		error(400, e?.body?.message || e)
	} finally {
		loading = false
	}
	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	console.log('add to cart')
	const data = Object.fromEntries(await request.formData())
	const pid = data.pid
	const vid = data.vid
	const variantsLength = +data.variantsLength
	const currentVariantId = data.currentVariantId
	const qty = +data.qty
	console.log('data', data)
	const linkedItems = JSON.parse(data.linkedItems || '[]')
	const options = JSON.parse(data.options || '[]') //data.options //
	const customizedImg = data.customizedImg
	const customizedData = data.customizedData
	let cartId = locals.cartId
	let sid = cookies.get('connect.sid')
	console.log('sid', sid)

	if (variantsLength > 0 && !currentVariantId) {
		return 'choose variant'
	}

	if (typeof pid !== 'string' || !pid) {
		return fail(400, { invalid: true })
	}

	console.log('cartId', cartId)

	try {
		// let cart = await services.CartService.addToCartService({
		// 	pid,
		// 	vid: currentVariantId || vid,
		// 	qty,
		// 	options,
		// 	customizedImg,
		// 	customizedData,
		// 	storeId: locals.storeId,
		// 	cartId,
		// 	origin: locals.origin,
		// 	sid // This is a special case to pass complete cookie
		// })
		let cart = await services.CartService.addToCartService({
			pid,
			vid: currentVariantId || vid,
			qty,
			options,
			customizedImg,
			customizedData,
			storeId: locals.storeId,
			cartId,
			origin: locals.origin,
			sid // This is a special case to pass complete cookie
		})
		// if (!cartId) { // Commented out because when can't find cart_id in database, it will still won't set the new cart_id in cookies
		cartId = cart.cart_id // This is required because when cart_id is null, it will add 3 items with null cart id hence last one prevails
		cookies.set('cartId', cartId, { path: '/', maxAge: 31536000 })
		// }

		if (!sid) {
			sid = cart.sid
			cookies.set('connect.sid', sid, { path: '/' })
		}

		if (linkedItems?.length) {
			for (const i of linkedItems) {
				cart = await services.CartService.addToCartService({
					pid: i,
					vid: i,
					qty: 1,
					storeId: locals.storeId,
					cartId,
					origin: locals.origin,
					sid // This is a special case to pass complete cookie
				})
			}
		}

		if (cart) {
			const cartObj = {
				cartId: cart?.cart_id,
				currencySymbol: cart?.currencySymbol,
				discount: cart?.discount,
				formattedAmount: cart?.formattedAmount,
				items: cart?.items,
				qty: cart?.qty,
				savings: cart?.savings,
				selfTakeout: cart?.selfTakeout,
				shipping: cart?.shipping,
				subtotal: cart?.subtotal,
				tax: cart?.tax,
				total: cart?.total,
				unavailableItems: cart?.unavailableItems
			}
			locals.cart = cartObj
			locals.cartId = cartObj.cartId
			// locals.cartQty = cartObj.qty

			if (!sid) {
				cookies.set('connect.sid', cart.sid, { path: '/' })
			}

			if (!cartId) cookies.set('cartId', cartObj.cartId, { path: '/', maxAge: 31536000 })

			return cartObj
		} else {
			return {}
		}
	} catch (e) {
		console.log('e', e)
		return {}
	}
}

const createBackOrder: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const pid = data.get('pid')
	const qty = +data.get('qty')
	let sid = cookies.get('connect.sid')

	if (typeof pid !== 'string' || !pid) {
		return fail(400, { invalid: true })
	}

	try {
		const cart = await services.CartService.createBackOrder({
			pid,
			qty,
			storeId: locals.storeId,
			origin: locals.origin,
			sid // This is a special case to pass complete cookie
		})

		if (!sid) {
			sid = cart.sid
			cookies.set('connect.sid', sid, { path: '/' })
		}
	} catch (e) {
		return {}
	}
}

const handleUnavailableItems: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const sid = cookies.get('connect.sid')

	try {
		const movedRes = await services.WishlistService.moveUnavailableItemsToWishlist({
			storeId: locals.storeId,
			origin: locals.origin,
			sid // This is a special case to pass complete cookie
		})

		// console.log('movedRes', movedRes);

		// if (movedRes.qty) {
		// 	locals.cartQty = movedRes.qty
		// }
	} catch (e) {
		return {}
	}

	return {}
}

export const actions: Actions = { add, createBackOrder, handleUnavailableItems }
