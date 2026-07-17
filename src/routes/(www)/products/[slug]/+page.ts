import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import { error, isRedirect } from '@sveltejs/kit'

// The core load 308-redirects to the homepage when a product isn't found. That is a
// soft-404: crawlers index the homepage under dead product URLs and shoppers get no
// explanation. Convert exactly that not-found redirect into a genuine HTTP 404 (the
// route's +error.svelte renders the recovery page); any other redirect or failure
// passes through untouched.
export const load = async (event: any) => {
	try {
		return await wwwProductsSlugLoad(event)
	} catch (e) {
		if (isRedirect(e) && e.location === '/') {
			error(404, 'Product not found')
		}
		throw e
	}
}
