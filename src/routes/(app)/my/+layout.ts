import { invalidate } from '$app/navigation'
import { redirect } from '@sveltejs/kit'

import Cookie from 'cookie-universal'
const cookies = Cookie()
export const prerender = false
export async function load({ url, params, parent, fetch }) {
	const { me, cart, store } = await parent()

	if (!me) {
		throw redirect(302, `/auth/otp-login?ref=${url.pathname}${url.search}`)
	}
	const isHome = url.pathname === '/'
	let currentPage = +url.searchParams.get('page') || 1
	let q = url.searchParams.get('q') || ''

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
