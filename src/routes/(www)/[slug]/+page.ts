import { error } from '@sveltejs/kit'
import { wwwSlugLoad } from '$lib/core/load-functions/index.js'
import type { PageLoad } from './$types'

// Non-term filters the slug route reads from the querystring. Their presence means the shopper
// narrowed a real listing, so an empty result is a legitimate 200 "no matches" page, not a 404.
const FILTER_PARAMS = ['search', 'price', 'tags', 'originCountry', 'keywords', 'page']

// This is the catch-all route: /wp-admin, /about and every typo or case variant lands here. The
// core load swallows its own failures and returns an empty result, so the page used to answer 200
// for any string at all — an unbounded space of thin, self-canonical, indexable pages titled after
// the URL. 404 when the slug resolves to neither a category nor a single product.
export const load: PageLoad = async (event) => {
	const data = (await wwwSlugLoad(event)) as {
		products?: { data?: unknown[]; categoryHierarchy?: unknown[] }
	}

	const resolved = data?.products?.categoryHierarchy?.length || data?.products?.data?.length
	const narrowed = FILTER_PARAMS.some((p) => event.url.searchParams.has(p))
	if (!resolved && !narrowed) error(404, 'Not found')

	return data
}
