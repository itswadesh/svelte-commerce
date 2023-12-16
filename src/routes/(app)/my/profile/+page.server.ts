import { error, redirect } from '@sveltejs/kit'
import { UserService } from '$lib/services'
import dayjs from 'dayjs'

export async function load({ cookies, locals }) {
	const { store, storeId, me, sid } = locals
	let profile = {}

	try {
		const data = await UserService.fetchMeData({
			storeId,
			server: true,
			sid
		})

		data.dob = data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : null

		profile = data || {
			email: me.email,
			firstName: me.firstName || '',
			lastName: me.lastName || ''
		}
	} catch (e) {
		if (e.status === 401) {
			redirect(307, '/auth/login')
		}

		error(e.status, e.message)
	} finally {
	}

	if (profile) {
		return { profile, store: store }
	}

	redirect(307, '/auth/login')
}
