import type { PageLoad } from '@sveltejs/kit'
export const load: PageLoad = async ({ url, session: { user } }) => {
	const ref = url.searchParams.get('ref')
	return { ref }
}
