import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

// Account surfaces that live in (www) instead of (my), so they never got the
// (my) group's session guard. Same redirect shape the core (my) layout uses.
const AUTHENTICATED_PATHS = ['/messages', '/profile']

export const load: LayoutServerLoad = async ({ cookies, setHeaders, url }) => {
	if (AUTHENTICATED_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`)) && !cookies.get('connect.sid')) {
		const searchParams = new URLSearchParams()
		searchParams.set('show_auth', 'true')
		searchParams.set('login', 'true')
		searchParams.set('redirect', `${url.pathname}?${url.searchParams.toString()}`)
		redirect(307, `/?${searchParams.toString()}`)
	}

	// /order-tracking opens an order from `?order=&key=` (the order emails' link), and /cart/<token> a
	// reminder's basket; the first prints the customer's
	// address and phone. Until that becomes a cookie/POST exchange, at least keep
	// the credential-bearing URL out of search indexes and outbound Referer headers.
	if (url.pathname === '/order-tracking' || url.pathname.startsWith('/cart/')) {
		setHeaders({
			'X-Robots-Tag': 'noindex, nofollow',
			'Referrer-Policy': 'no-referrer'
		})
	}

	// A home-page draft opened through a preview key: never stored by a cache, never indexed.
	if (url.pathname === '/' && url.searchParams.has('preview')) {
		setHeaders({
			'Cache-Control': 'no-store',
			'X-Robots-Tag': 'noindex, nofollow'
		})
	}

	return {}
}
