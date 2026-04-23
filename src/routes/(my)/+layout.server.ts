//export { myLayoutServer as load } from '$lib/core/load-functions/index.js'

import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = async ({ fetch, url, cookies }) => {
	const sid = cookies.get('connect.sid')
	if (!sid) {
    const searchParams = new URLSearchParams()
    searchParams.set('show_auth', 'true')
    searchParams.set('login', 'true')
    searchParams.set('redirect', url.pathname + '?' + url.searchParams.toString())
    redirect(307, '/?' + searchParams.toString())
  }
}

