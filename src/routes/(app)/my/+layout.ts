import { redirect } from '@sveltejs/kit'

export const prerender = false
export async function load({ url, params, parent, locals }) {
	const { me, cart, store } = await parent()

	if (!me) {
		throw redirect(302, `/auth/otp-login?ref=${url.pathname}${url.search}`)
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
