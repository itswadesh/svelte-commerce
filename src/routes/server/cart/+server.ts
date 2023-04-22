import { CartService } from '$lib/services'

export async function GET({ request, locals, cookies }) {
	let cart: any = {}
	cart = await CartService.fetchMyCart({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid'),
		origin: locals.origin
	})
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartId', cart.cart_id, { path: '/' })
	cookies.set('cartQty', cart.qty, { path: '/' })
	return new Response(JSON.stringify(cart))
}
