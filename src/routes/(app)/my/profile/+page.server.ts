import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
import dayjs from 'dayjs'

export async function load({ request, locals }) {
	const { me, store } = locals
	let profile = {}
	try {
		const data = await gett(`users/me`, request.headers.get('cookie'))
		data.dob = data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : null
		profile = data || {
			email: me.email,
			firstName: me.firstName || '',
			lastName: me.lastName || ''
		}
	} catch (e) {
		throw error(e.status, e.message)
	} finally {
	}
	if (profile) {
		return { profile, store: store }
	}
	throw redirect(307, 'Please login again')
}
