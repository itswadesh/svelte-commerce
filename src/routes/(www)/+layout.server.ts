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

	// /order-tracking authenticates from `?email=&otp=` and prints the customer's
	// address and phone. Until that becomes a cookie/POST exchange, at least keep
	// the credential-bearing URL out of search indexes and outbound Referer headers.
	if (url.pathname === '/order-tracking') {
		setHeaders({
			'X-Robots-Tag': 'noindex, nofollow',
			'Referrer-Policy': 'no-referrer'
		})
	}

	return {}
}
