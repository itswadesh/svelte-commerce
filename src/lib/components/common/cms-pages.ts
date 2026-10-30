import { pageService } from '$lib/core/services/index.js'
import { aliasedPath } from '$lib/path-aliases'

/**
 * Which CMS-backed pages this store actually publishes.
 *
 * Five footer links — About Us, Privacy Policy, Terms and Conditions, Shipping Policy and Refund
 * Policy — are static theme content, but the pages behind them are authored in the merchant's CMS.
 * A backend with no CMS — some answer every page request empty — or a merchant who never wrote
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
 * Remembered per store for a minute, as the connector remembers a store's menus. It used to be
 * once per server process for every store: on a backend that serves many shops from one
 * storefront, the first shop's pages decided every other shop's footer, and a page a merchant
 * published stayed unlinked until a restart.
 */
const TTL_MS = 60_000
const cached = new Map<string, { at: number; slugs: Promise<string[]> }>()

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

/** `store` is whatever tells this request's shop apart — its host. */
export function publishedCmsSlugs(store = ''): Promise<string[]> {
	const hit = cached.get(store)
	if (hit && Date.now() - hit.at < TTL_MS) return hit.slugs
	const slugs = fetchPublishedSlugs().catch(() => [])
	cached.set(store, { at: Date.now(), slugs })
	return slugs
}

/**
 * The CMS-backed path a link leads to, or null when it leads anywhere else. A link reaches those
 * pages under other names too: a backend's own menus say `/pages/privacy` (redirected to
 * `/privacy-policy`, see path-aliases.ts) or `/p/about-us`, the generic page route. Each of those
 * 404s on an unpublished page exactly as the direct path does.
 */
function cmsPathOf(href: string): string | null {
	if (!href.startsWith('/') || href.startsWith('//')) return null
	let path: string
	try {
		const url = new URL(href, 'https://store.invalid')
		path = aliasedPath(url) ?? (url.pathname.replace(/\/+$/, '') || '/')
	} catch {
		return null // a malformed escape in a merchant's link; the router will say what it is
	}
	const generic = /^\/p\/([^/]+)$/.exec(path)?.[1]
	const target = generic ? `/${generic}` : path
	return CMS_BACKED_PATHS.has(target) ? target : null
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
	const path = cmsPathOf(href)
	return !path || new Set(published).has(slugOf(path))
}

/**
 * Drop links to CMS pages this store does not publish, under any of their names (cmsPathOf), so a
 * page a store has only drafted is never a footer link. Anything that is not a CMS-backed page —
 * `/products`, `/contact-us`, `/faqs`, `/blog`, an external URL — is left exactly as it is.
 */
export function keepResolvableLinks<T extends { link?: string; href?: string }>(links: T[], published: Iterable<string>): T[] {
	const available = new Set(published)
	return links.filter((entry) => {
		const path = cmsPathOf(entry?.link ?? entry?.href ?? '')
		return !path || available.has(slugOf(path))
	})
}
