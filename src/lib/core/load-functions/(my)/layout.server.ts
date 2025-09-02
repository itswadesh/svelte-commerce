import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from '../../../../routes/(my)/$types'

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	const sid = cookies.get('connect.sid')

	if (!sid) redirect(307, '/?show_auth=true&login=true')
}
