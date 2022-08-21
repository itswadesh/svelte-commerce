export async function load({ url, params, fetch, session, context }) {
let ref, role
try {
	ref = url.searchParams.get('ref')
	role = url.searchParams.get('role') || 'user'
} catch (e) {
	toast(e, 'error')
} finally {
}
return {
	me: session.me,
	store: session.store,
	ref,
	role
}
}
