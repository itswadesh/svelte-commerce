// import { invalidateAll } from '$app/navigation'
import { redirect } from '@sveltejs/kit'

// import Cookie from 'cookie-universal'
// const cookies = Cookie()
export const prerender = false
export async function load({ url, params, locals, parent }) {
	const { me, cart, store } = locals
	if (!me) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}
	const isHome = url.pathname === '/'
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''

	return {
		url: url.href,
		currentPage,
		q,
		isHome,
		me,
		cart,
		store
	}
}
