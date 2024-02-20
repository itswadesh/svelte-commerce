import { services } from '@misiki/litekart-utils'

export async function GET({ request, locals, cookies }) {
	let cart: any = {}

	cart = await services.CartService.fetchMyCart({
		cartId: cookies.get('cartId'),
		origin: locals.origin,
		sid: cookies.get('connect.sid'),
		storeId: locals.storeId
	})
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartQty', cart.qty, { path: '/' })

	return new Response(JSON.stringify(cart))
}
