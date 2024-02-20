import { error, redirect } from '@sveltejs/kit'
import { UserService } from '$lib/services'
import { services } from '@misiki/litekart-utils'
export async function load({ params, locals, url, cookies, request }) {
	const { store, origin } = locals
	try {
		const expires = url?.searchParams.get('expires')
		const id = url?.searchParams.get('id')
		const signature = url?.searchParams.get('signature')
		const token = url?.searchParams.get('token')
		const sid = cookies.get('connect.sid')

		const res = await services.UserService.verifyEmail({
			id,
			expires,
			signature,
			token,
			origin,
			sid,
			storeId: store?.id
		})
		if (res) {
			throw { status: 307 }
		}
	} catch (e) {
		console.error('error at verify', e?.status)

		if (e?.status === 307) {
			redirect(302, '/auth/verification-success')
		}

		error(e.status, e.message)
	}
}
