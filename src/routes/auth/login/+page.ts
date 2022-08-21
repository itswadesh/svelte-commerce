export async function load({ url, params, fetch, session, context }) {
const ref = url.searchParams.get('ref')
// if (session.me) {
// 	return {
// 		status: 302,
// 		redirect: ref || '/my'
// 	}
// }

return {
	me: session.me,
	store: session.store,
	ref
}
}
