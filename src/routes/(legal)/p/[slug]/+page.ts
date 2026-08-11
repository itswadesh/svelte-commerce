import { redirect } from '@sveltejs/kit'
import { requireCmsPage } from '../../cms-page-load'
import type { PageLoad } from './$types'

// These slugs already have dedicated routes that fetch the very same CMS record and
// self-canonicalise, so /p/<slug> is a duplicate URL splitting link equity. Send it home.
const RESERVED_SLUGS = new Set(['about-us', 'contact-us', 'privacy-policy', 'refund-policy', 'shipping-policy', 'terms-and-conditions'])

export const load: PageLoad = ({ params, data }) => {
	if (RESERVED_SLUGS.has(params.slug)) redirect(301, `/${params.slug}`)
	// Must return `data`: a universal load replaces its node's server data rather than merging
	// into it, so falling off the end here would blank the page for every non-reserved slug.
	return requireCmsPage(data)
}
