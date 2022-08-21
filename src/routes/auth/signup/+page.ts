import { toast } from '$lib/util'

export async function load({ url, params, fetch, parent, context }) {
	const { user } = await parent()

	let ref, role
	try {
		ref = url.searchParams.get('ref')
		role = url.searchParams.get('role') || 'user'
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
	return {
		me: user.me,
		store: user.store,
		ref,
		role
	}
}
