// Where a shopper who has to sign in is sent: `page`, with the sign-in dialog open, which returns
// them to `to` once they are in (login-modal reads `redirect`).
export function signInFirst(to: string, page = '/checkout/cart'): string {
	return `${page}?${new URLSearchParams({ show_auth: 'true', login: 'true', redirect: to })}`
}

// The pages a visitor still opens in a shop only signed-in customers may browse (GoCommerce D341):
// signing in and up, and the contact and content pages the shop's policies live on. The (legal)
// group — privacy, refunds, shipping, terms, about, FAQs, blog — sits outside (www) and is never
// gated; /order-tracking opens an existing order from its email link.
const OPEN_PAGES = /^\/(auth|contact|pages|order-tracking)(\/|$)/

export const isOpenPage = (pathname: string) => OPEN_PAGES.test(pathname)

// The sign-in screen, remembering where the visitor was going. A link that already carries a
// `redirect` (the account pages send one) keeps its destination rather than nesting it.
export function signInScreen(url: URL): string {
	const to = url.searchParams.get('redirect') || url.pathname + url.search
	return `/sign-in?${new URLSearchParams({ redirect: to })}`
}

// The checkout steps a guest cannot take when the store has guest checkout off (GoCommerce D340).
// The bag stays open: it is where they sign in, and the basket is kept.
export const isCheckoutStep = (pathname: string) => /^\/checkout\/(address|payment)(\/|$)/.test(pathname)
