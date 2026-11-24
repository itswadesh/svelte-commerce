import { wwwProductsLoadServer } from '$lib/core/load-functions/index.js'
import { MAIN_CATEGORY_COOKIE, parseMainCategory } from '$lib/components/common/main-category'
import type { PageServerLoad } from './$types'

// The main category the shopper was browsing, so a search results page loaded straight from the
// server draws its "Back to <category>" in the first HTML instead of inserting it on hydration.
export const load: PageServerLoad = async (event) => ({
	...((await wwwProductsLoadServer(event as never)) as object),
	mainCategory: parseMainCategory(event.cookies.get(MAIN_CATEGORY_COOKIE))
})
