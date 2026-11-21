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

/**
 * Routes under `(legal)` whose content comes from the CMS, keyed by the path the footer links, and
 * the page names (slugs) each may be stored under, the route's own first. GoCommerce gives a new
 * store `about`, `shipping` and `returns`; only the long names were asked for, so /refund-policy,
 * /shipping-policy and /about-us were 404s on a store that had all three, and their footer links
 * were hidden.
 */
export const CMS_PAGE_SLUGS: Record<string, string[]> = {
	'/about-us': ['about-us', 'about'],
	'/privacy-policy': ['privacy-policy', 'privacy'],
	'/terms-and-conditions': ['terms-and-conditions', 'terms'],
	'/shipping-policy': ['shipping-policy', 'shipping'],
	'/refund-policy': ['refund-policy', 'returns', 'refunds', 'return-policy']
}

export const CMS_BACKED_PATHS = new Set(Object.keys(CMS_PAGE_SLUGS))

/** Whether a CMS-backed path has its page published under any of its names. */
function isPublished(path: string, slugs: Set<string>): boolean {
	return (CMS_PAGE_SLUGS[path] ?? [slugOf(path)]).some((slug) => slugs.has(slug))
}

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

	const probes = Object.values(CMS_PAGE_SLUGS)
		.flat()
		.map(async (slug) => {
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
export function cmsPathOf(href: string): string | null {
	if (!href.startsWith('/') || href.startsWith('//')) return null
	let path: string
	try {
		const url = new URL(href, 'https://store.invalid')
		path = aliasedPath(url) ?? (url.pathname.replace(/\/+$/, '') || '/')
	} catch {
		return null // a malformed escape in a merchant's link; the router will say what it is
	}
	// The generic page route, under any of a policy page's names: /p/returns is /refund-policy.
	const generic = /^\/p\/([^/]+)$/.exec(path)?.[1]
	if (generic) {
		let slug = generic
		try {
			slug = decodeURIComponent(generic)
		} catch {
			// Keep it as written.
		}
		return Object.keys(CMS_PAGE_SLUGS).find((key) => CMS_PAGE_SLUGS[key].includes(slug)) ?? null
	}
	return CMS_BACKED_PATHS.has(path) ? path : null
}

/**
 * Columns of links with each policy page linked once: a later link to a page already linked, under
 * any of its names, is dropped, and a column left empty with it. A store's footer menu can carry
 * both /about-us and /p/about; once both resolve to the store's `about` page, it showed twice.
 */
export function withoutRepeatedPages<T extends { items: any[] }>(columns: T[]): T[] {
	const seen = new Set<string>()
	return columns
		.map((column) => ({
			...column,
			items: column.items.filter((item) => {
				const key = cmsPathOf(item?.link ?? item?.href ?? '')
				if (!key) return true
				if (seen.has(key)) return false
				seen.add(key)
				return true
			})
		}))
		.filter((column) => column.items.length)
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
	return !path || isPublished(path, new Set(published))
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
		return !path || isPublished(path, available)
	})
}
