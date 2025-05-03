// import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
// import { env } from '$env/dynamic/public'

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// if (!url.pathname.startsWith('/auth') && env.PUBLIC_IS_LANDING_PAGE) {
	// 	throw redirect(307, '/dash')
	// }
	return {}
}
