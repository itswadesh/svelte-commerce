
import { houdiniClient } from '$graphql/client'
houdiniClient.init()
export async function load({ url, params, fetch, session, context }) {
const isHome = url.pathname === '/'
let me = session.me
return {
	url,
	me,
	isHome,
	store: session.store
}
}
