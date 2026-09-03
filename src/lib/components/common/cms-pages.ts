import { pageService } from '$lib/core/services/index.js'

/**
 * Which CMS-backed pages this store actually publishes.
 *
 * Five footer links — About Us, Privacy Policy, Terms and Conditions, Shipping Policy and Refund
 * Policy — are static theme content, but the pages behind them are authored in the merchant's CMS.
 * A backend with no CMS (GoCommerce answers every page request empty) or a merchant who never wrote
 * them leaves all five resolving to a bare 404 with no header and no footer, linked from the bottom
 * of every page on the site. The contact form's own consent line pointed at the same dead policies,
 * so a shopper could not read the terms before writing in.
 *
 * The storefront cannot know which exist without asking, so it asks once and remembers. Failure is
 * not fatal: an unreachable page service returns "none known", and the links are hidden rather than
 * shipped broken.
 */

/** Routes under `(legal)` whose content comes from the CMS, keyed by the path the footer links. */
export const CMS_BACKED_PATHS = new Set(['/about-us', '/privacy-policy', '/terms-and-conditions', '/shipping-policy', '/refund-policy'])

function slugOf(path: string) {
	return path.replace(/^\/+/, '').replace(/\/+$/, '')
}

/**
 * Resolved once per server process. The set changes only when a merchant authors a page, so a
 * per-request round trip would buy nothing; a deploy or restart picks up new pages.
 */
let cached: Promise<string[]> | null = null

async function fetchPublishedSlugs(): Promise<string[]> {
	const found: string[] = []
	// `list()` is the cheap path where a backend implements it. Where it does not — it answers an
	// empty page — fall back to asking for each of the five by slug, which is what the routes
	// themselves do, so the answer always matches what the route will actually render.
	try {
		const listed: any = await pageService.list({ page: 1, limit: 100 })
		const rows: any[] = listed?.data ?? listed?.results ?? []
		for (const row of rows) {
			const slug = row?.slug ?? row?.handle
			if (slug) found.push(String(slug))
		}
		if (found.length) return found
	} catch {
		// Fall through to the per-slug probe.
	}

	const probes = [...CMS_BACKED_PATHS].map(async (path) => {
		const slug = slugOf(path)
		try {
			const record: any = await pageService.getOne(slug)
			const hasContent = !!(record?.content || record?.layouts?.length)
			return hasContent ? slug : null
		} catch {
			return null
		}
	})
	return (await Promise.all(probes)).filter(Boolean) as string[]
}

export function publishedCmsSlugs(): Promise<string[]> {
	cached ??= fetchPublishedSlugs().catch(() => [])
	return cached
}

/**
 * Whether a link to a CMS-backed page would actually resolve. Anything outside that set — an
 * external URL, `/contact-us`, `/products` — always resolves and is never gated.
 *
 * Callers use this for two different jobs. `PolicyLink` uses it to decide between an anchor and
 * plain text. A consent sentence uses it to decide whether to make the claim at all: telling a
 * shopper they agree to terms the store cannot show them is not something a working link would fix.
 */
export function isCmsPageResolvable(href: string, published: Iterable<string>): boolean {
	if (!CMS_BACKED_PATHS.has(href)) return true
	return new Set(published).has(slugOf(href))
}

/**
 * Drop links to CMS pages this store does not publish. Anything that is not a CMS-backed path —
 * `/products`, `/contact-us`, `/faqs`, `/blog`, an external URL — is left exactly as it is.
 */
export function keepResolvableLinks<T extends { link?: string; href?: string }>(links: T[], published: Iterable<string>): T[] {
	const available = new Set(published)
	return links.filter((entry) => {
		const href = entry?.link ?? entry?.href
		if (!href || !CMS_BACKED_PATHS.has(href)) return true
		return available.has(slugOf(href))
	})
}
