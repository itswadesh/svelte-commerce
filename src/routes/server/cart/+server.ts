import { fetchMyCart } from '$lib/services/CartService'

export async function GET({ request, locals, cookies }) {
	let cart: any = {}
	const d = new Date()
	cart = await fetchMyCart({
		storeId: locals.store?.id,
		server: true,
		sid: cookies.get('connect.sid')
	})
	const d3 = new Date()
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartId', cart.cart_id, { path: '/' })
	cookies.set('cartQty', cart.qty, { path: '/' })
	return new Response(JSON.stringify(cart))
}
