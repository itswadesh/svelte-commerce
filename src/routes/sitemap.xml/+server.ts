import type { RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

/*
 * The stock handler (kitcommerce-core `redirectToSitemap`) 302-redirects to the
 * store record's `sitemap` URL. The storefront API account is SHARED across the
 * fleet, so that field points at the supplier's sitemap on a raw R2 bucket
 * (…/sitemaps/jewelwesell.com-sitemaps/sitemap_index.xml) — leaking the supplier
 * brand + bucket to crawlers. Worse, the bucket rejects unsigned GETs, so the
 * redirect target serves crawlers a 400 error document, not a sitemap.
 *
 * Serve the sitemap same-domain instead, never a redirect:
 *  1. PROXY: if the store record's sitemap URL is fetchable server-side and is a
 *     plain <urlset>, serve it with every URL's host rewritten to this domain
 *     (the catalogue is shared, so slugs match). Keeps admin-generated lastmod.
 *  2. GENERATE (today's path, while the bucket is auth-walled): this domain's
 *     static routes plus every product slug from the live catalogue API.
 * Fail soft — an API hiccup yields a shorter sitemap, never a 500.
 */

const STATIC_PATHS = [
	'/',
	'/products',
	'/blog',
	'/contact-us',
	'/faqs',
	'/privacy-policy',
	'/refund-policy',
	'/shipping-policy',
	'/terms-and-conditions'
]

const MAX_PAGES = 60 // products API pageSize is server-fixed at 20 → covers 1200 products

const xmlEscape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const headers = { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' }

// Cloudflare does not cache XML by default, so serve repeat crawler hits from a
// process-local memo instead of re-walking the catalogue every request.
let memo: { host: string; xml: string; at: number } | null = null
const MEMO_TTL_MS = 60 * 60 * 1000

export const GET: RequestHandler = async ({ fetch, url, cookies }) => {
	const origin = `https://${url.host}`
	const apiUrl = env.PUBLIC_LITEKART_API_URL
	const storeId = env.PUBLIC_LITEKART_STORE_ID || cookies.get('litekart_store_id')

	if (memo && memo.host === url.host && Date.now() - memo.at < MEMO_TTL_MS) {
		return new Response(memo.xml, { headers })
	}

	// 1) Proxy + host-rewrite the upstream sitemap when it is actually fetchable.
	if (apiUrl && storeId) {
		try {
			const storeRes = await fetch(`${apiUrl}/api/stores/${storeId}`, {
				headers: { 'x-litekart-store': storeId }
			})
			const upstream = storeRes.ok ? (await storeRes.json())?.sitemap : null
			if (upstream) {
				const res = await fetch(upstream)
				if (res.ok) {
					const xml = await res.text()
					// Only a flat <urlset> can be host-rewritten safely; a <sitemapindex>'s
					// children live on the same auth-walled bucket, so fall through instead.
					if (xml.includes('<urlset')) {
						const rewritten = xml.replace(/<loc>\s*https?:\/\/[^/<]+/g, `<loc>${origin}`)
						memo = { host: url.host, xml: rewritten, at: Date.now() }
						return new Response(rewritten, { headers })
					}
				}
			}
		} catch {
			/* fall through to the generated sitemap */
		}
	}

	// 2) Generate from the live catalogue. Page 1 reveals count/pageSize; the rest
	// fetch in parallel (sequential paging took ~38s — long enough for crawlers to bail).
	const slugs: string[] = []
	if (apiUrl && storeId) {
		try {
			const getPage = (page: number) =>
				fetch(`${apiUrl}/api/products?page=${page}`, { headers: { 'x-litekart-store': storeId } })
					.then((r) => (r.ok ? r.json() : null))
					.catch(() => null)
			const collect = (body: any) => {
				for (const p of body?.data ?? []) if (p?.slug) slugs.push(p.slug)
			}
			const first = await getPage(1)
			if (first) {
				collect(first)
				const count = Number(first?.count ?? 0)
				const pageSize = Number(first?.pageSize ?? (first?.data?.length || 0))
				const pages = pageSize ? Math.min(Math.ceil(count / pageSize), MAX_PAGES) : 1
				const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => getPage(i + 2)))
				for (const body of rest) if (body) collect(body)
			}
		} catch {
			// fail soft: ship the static URLs (+ whatever products were fetched)
		}
	}

	const urls = [
		...STATIC_PATHS.map((p) => `${origin}${p}`),
		...slugs.map((s) => `${origin}/products/${s}`)
	]

	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		urls.map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`).join('\n') +
		`\n</urlset>\n`

	// Only memoize a complete walk — a fail-soft partial should retry next request.
	if (slugs.length) memo = { host: url.host, xml, at: Date.now() }
	return new Response(xml, { headers })
}
