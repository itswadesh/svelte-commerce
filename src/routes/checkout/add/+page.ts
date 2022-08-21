import { loginUrl } from '$lib/store'
import { redirect } from '@sveltejs/kit'
export const load = async ({ url, parent }) => {
	const { user } = await parent()

	if (!user?.me) {
		throw redirect(302, `/${loginUrl}?ref=${url.pathname}`)
	}
	return {}
}
