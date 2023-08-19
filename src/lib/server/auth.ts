import type { RequestEvent } from '@sveltejs/kit'
import type { Me } from '$lib/types'
export const authenticateUser = (event: RequestEvent) => {
	const meFromCookie: string | undefined = event.cookies.get('me')
	const sidFromCookie: string | undefined = event.cookies.get('connect.sid')
	if (
		meFromCookie &&
		meFromCookie != 'undefined' &&
		sidFromCookie &&
		sidFromCookie != 'undefined'
	) {
		const me: Me = JSON.parse(meFromCookie)
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
