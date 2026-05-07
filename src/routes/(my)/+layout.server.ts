//export { myLayoutServer as load } from '$lib/core/load-functions/index.js'
import { myLayoutServer } from '@misiki/kitcommerce-core/load-functions'

import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = myLayoutServer(redirect)
