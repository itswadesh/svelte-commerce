import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { services } from '@misiki/litekart-utils'

export const load: PageServerLoad = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page
	redirect(307, '/')
}

export const actions: Actions = {
	async default({ cookies, locals }) {
		await services.UserService.logoutService({
			storeId: locals.storeId,
			sid: cookies.get('connect.sid')
		})
		// eat the cookie

		// cookies.set('storeId', null, {
		// 	path: '/',
		// 	expires: new Date(0)
		// })

		cookies.set('settings', null, {
			path: '/',
			expires: new Date(0)
		})

		cookies.set('session', null, {
			path: '/',
			expires: new Date(0)
		})

		cookies.set('connect.sid', null, {
			path: '/',
			expires: new Date(0)
		})

		cookies.set('sid', null, {
			path: '/',
			expires: new Date(0)
		})

		cookies.set('me', null, {
			path: '/',
			expires: new Date(0)
		})

		locals.settings = null
		locals.session = null
		locals.me = null
		locals.sid = null

		//redirect the user

		redirect(307, '/auth/login')
	}
}
