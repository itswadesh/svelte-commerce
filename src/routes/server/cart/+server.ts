import { gett } from '$lib/utils/server'

export async function GET({ request, locals, cookies }) {
	let cart: any = {}
	const d = new Date()
	cart = await gett(`carts/my?store=${locals?.store?.id}`, request.headers.get('cookie'))
	const d3 = new Date()
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartId', cart.cart_id, { path: '/' })
	cookies.set('cartQty', cart.qty, { path: '/' })
	return new Response(JSON.stringify(cart))
}
