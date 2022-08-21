import { GQL_verifyEmail } from '$houdini'
import { toast } from '$lib/util'
import { redirect } from '@sveltejs/kit'
import Cookie from 'cookie-universal'
const coookies = Cookie()
export async function load({ url, params, fetch, session, context }) {
	let err
	const isHome = url.pathname === '/'
	let currentPage = +url.searchParams.get('page') || 1
	let id = url.searchParams.get('id') || ''
	let token = url.searchParams.get('token') || ''
	let expires = url.searchParams.get('expires') || ''
	let signature = url.searchParams.get('signature') || ''
	const me = session.me
	try {
		const ve = await GQL_verifyEmail.mutate({
			variables: {
				id,
				token,
				signature,
				expires,
				store: session.store?.id
			}
		})
		if (ve.errors) {
			err = ve.errors[0].message
			toast(err, 'error')
		} else {
			throw redirect(302, `/auth/verification-success`)
		}
	} catch (e) {
		this.$store.commit('setErr', e)
	}
	return {
		id,
		token,
		expires,
		signature,
		me,
		err
	}
}
