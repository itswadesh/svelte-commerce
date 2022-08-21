export async function load({ url, params, fetch, session, context }) {
const ref = url.searchParams.get('ref')
// let go = '/auth/login'
// if (session.settings.otpLogin) {
// 	go = `/auth/phone-login`
// }
return {
	me: session.me,
	store: session.store,
	ref
}
}
