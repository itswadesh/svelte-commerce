import { error } from '@sveltejs/kit'
import { AuthService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../../routes/(www)/auth/verify/$types'

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
	try {
		const email = url.searchParams.get('email')
		const token = url.searchParams.get('token')
		if (!email || !token) {
			throw error(400, 'Invalid email or token')
		}
		const authService = new AuthService(fetch)
		const user = await authService.verifyEmail(email, token)
		return {
			status: 'success'
		}
	} catch (e) {
		console.error('Error loading categories:', e)
		return {
			status: 'failed'
		}
	}
}

