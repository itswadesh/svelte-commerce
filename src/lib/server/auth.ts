import type { RequestEvent } from '@sveltejs/kit'
export const authenticateUser = (event: RequestEvent) => {
	let me: any = event.cookies.get('me')
	if (me) {
		me = JSON.parse(me)
		return {
			active: me.active,
			avatar: me.avatar,
			email: me.email,
			firstName: me.firstName,
			lastName: me.lastName,
			phone: me.phone,
			role: me.role,
			verified: me.verified
		}
	} else {
		return null
	}
}
