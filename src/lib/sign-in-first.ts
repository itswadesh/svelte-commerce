// Where a shopper who has to sign in is sent: `page`, with the sign-in dialog open, which returns
// them to `to` once they are in (login-modal reads `redirect`).
export function signInFirst(to: string, page = '/checkout/cart'): string {
	return `${page}?${new URLSearchParams({ show_auth: 'true', login: 'true', redirect: to })}`
}

// The checkout steps a guest cannot take when the store has guest checkout off (GoCommerce D340).
// The bag stays open: it is where they sign in, and the basket is kept.
export const isCheckoutStep = (pathname: string) => /^\/checkout\/(address|payment)(\/|$)/.test(pathname)
