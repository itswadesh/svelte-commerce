import { redirect } from '@sveltejs/kit'
export const load = async ({ url, fetch, session }) => {
	let me = session.me
	let store = session.store
	if (!me) {
		throw redirect(302, `/auth/login?ref=${url.pathname}`)
	}
	return { me, store, q: '' }
}
