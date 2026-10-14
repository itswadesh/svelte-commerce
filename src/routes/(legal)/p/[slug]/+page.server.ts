import { PageService } from '$lib/core/services'
import { error, redirect } from '@sveltejs/kit'

// Other names for pages that have a dedicated route. Footers configured in the store admin link
// /p/return-policy, which no CMS record answers; the returns policy lives at /refund-policy. Checked here rather
// than in +page.ts, because the CMS lookup below 404s before the universal load ever runs.
const ALIASES: Record<string, string> = { 'return-policy': '/refund-policy' }

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
