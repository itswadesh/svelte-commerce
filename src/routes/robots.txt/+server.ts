import type { RequestHandler } from '@sveltejs/kit'

// The rules used to come from `robotsTxt()` in @misiki/kitcommerce-core, but that builder shipped
// two defects that can only be fixed by generating the body here (the package is not editable):
//
//  1. It advertised `https://<host>/sitemaps/<host>-sitemaps/sitemap_index.xml` — a path this app
//     has no route for. The endpoint that actually serves a sitemap is /sitemap.xml (it already
//     proxies the S3 sitemap index when the store has one), so that is what gets declared.
//  2. It put every Disallow in the `User-agent: *` group and then opened ten *named* groups after
//     it. A crawler obeys exactly one group — the most specific user-agent match — and ignores `*`
//     entirely once a named group exists, so all ten named bots (the AI agents and the SEO
//     crawlers) were being handed /checkout/, /my/, /auth/ and /api/. Every group now carries its
//     own copy of the rules.
//
// `Allow: /` alongside the disallows is safe: robots.txt resolves conflicts by longest match, so
// `Disallow: /checkout/` still beats `Allow: /`.

const RULES = `# Account, checkout and transactional flows — no crawl value
Disallow: /checkout/
Disallow: /my/
Disallow: /auth/
Disallow: /profile
Disallow: /wishlist
Disallow: /messages
Disallow: /order-tracking
Disallow: /subscription-success
Disallow: /api/
Disallow: /health
# Facets, sort and search: canonicals already point these back to the base listing,
# so keep them out of the crawl. Pagination (?page=) stays crawlable — it is the
# discovery path for products.
Disallow: /*?*attributes.
Disallow: /*?*sort=
Disallow: /*?*priceFrom=
Disallow: /*?*priceTo=
Disallow: /*?*tags=
Disallow: /*?*search=`

// AI agents we explicitly want crawling for search and citation.
const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended', 'ClaudeBot', 'anthropic-ai']

// Third-party SEO crawlers: throttle rather than block — they hammer a large catalogue.
const SEO_BOTS = ['AhrefsBot', 'AhrefsSiteAudit', 'SemrushBot', 'MJ12bot']

export const GET: RequestHandler = async ({ url }) => {
	const origin = `https://${url.host}`

	const groups = [
		`User-agent: *\n${RULES}`,
		...AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /\n${RULES}`),
		...SEO_BOTS.map((bot) => `User-agent: ${bot}\nCrawl-delay: 10\n${RULES}`)
	]

	const body = `# we use Litekart as our ecommerce platform

${groups.join('\n\n')}

Sitemap: ${origin}/sitemap.xml
# Route manifest for AI agents (there is no standard robots.txt directive for it):
# ${origin}/llms.txt
`

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	})
}
