import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { hasSession, storeSwitches } from '$lib/server/store-plugins'

// The screen a shop only signed-in customers may browse shows in place of its pages (GoCommerce
// D341). Somebody signed in, or a store that is open to all, has nothing to do here and goes on to
// where they were headed. Only an address on this site is followed.
export const load: PageServerLoad = async ({ cookies, url, setHeaders }) => {
	const to = url.searchParams.get('redirect') ?? ''
	const next = to.startsWith('/') && !to.startsWith('//') ? to : '/'
	if (hasSession(cookies) || (await storeSwitches()).signInToShop?.active !== true) redirect(303, next)
	setHeaders({ 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' })
	return { next }
}
