import { PageService } from '$lib/core/services'
import { error, redirect } from '@sveltejs/kit'
import { CMS_PAGE_SLUGS } from '$lib/components/common/cms-pages'

// Every name of a page that has a dedicated route goes to that route. /p/about, /p/returns and
// /p/shipping served the same page as /about-us, /refund-policy and /shipping-policy, each calling
// itself canonical, so a search engine saw three duplicate pairs; and footers configured in the
// store admin link /p/return-policy, which no CMS record answers. Checked here rather than in
// +page.ts, because the CMS lookup below 404s before the universal load ever runs.
const ALIASES: Record<string, string> = Object.fromEntries(
	Object.entries(CMS_PAGE_SLUGS).flatMap(([path, slugs]) => slugs.map((slug) => [slug, path]))
)

export async function load({ parent, params, fetch }) {
	const { slug } = params
	if (ALIASES[slug]) redirect(301, ALIASES[slug])
	// const { store } = await parent()
	try {
		const pageService = new PageService(fetch)
		const page = await pageService.getOne(slug)
		return { page }
	} catch (err: any) {
		console.error('Error fetching page: p/[slug]', err)
		error(404, 'Page not found')
	}
}
