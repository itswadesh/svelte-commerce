// This is unused, the code used is from routes/server/store/+server.ts

export const fetchCart = async (event) => {
	try {
		const sid = event.cookies.get('connect.sid')
		const cartId: string = event.cookies.get('cartId')
		const cartQty: string = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty
		if (sid) event.locals.sid = sid
	} catch (e) {
		return null
	}
}
