import { gett } from '$lib/utils'

export async function GET({ request, locals, cookies }) {
	// console.log('get............')
	let cart: any = {}
	const d = new Date()
	cart = await gett(`carts/my?store=${locals?.store?.id}`, request.headers.get('cookie'))
	// page.update('cart', cart)
	// console.log('cart...........', cart)
	const d3 = new Date()
	console.log('cart loaded at Footer: ', d3.getTime() - d.getTime())
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartId', cart.cart_id, { path: '/' })
	cookies.set('cartQty', cart.qty, { path: '/' })
	// cookies.set('cart', JSON.stringify(cart), { path: '/' })
	return new Response(JSON.stringify(cart))
}
