import type { RequestHandler } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { BlogService, categoryService } from '$lib/core/services/index.js'

// Replaces the old static/llms.txt, which described the open-source template ("# Svelte Commerce",
// a GitHub link, a list of supported backends) and shipped byte-identical to every deployment. This
// renders the *store* — the one file written specifically for answer engines should say what the
// shop is and sells, not what framework it was built with.
//
// The route inventory below is the real one: category/term listings are the bare `/<slug>` route
// (there is no /categories/<slug>), /order-tracking is dropped because robots.txt disallows it, and
// the three policy pages an AI shopping agent actually needs are listed.

const stripHtml = (value: unknown) =>
	String(value ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

// The file names only what this store has: /vendors with the marketplace on, /blog once there is a
// post, and category examples from its own menu (it used to say `/pendant` on a clothes shop).
// Any lookup that fails leaves its part out rather than failing the file.
const quietly = <T>(work: () => Promise<T>): Promise<T | null> => work().catch(() => null)

export const GET: RequestHandler = async (event) => {
	// A failed store lookup (bad domain mapping, upstream blip) still serves a usable route manifest
	// rather than a 500.
	const [layout, blogs, tree] = await Promise.all([
		quietly(() => layoutServer(event as any)),
		quietly(() => new BlogService(event.fetch).list({ page: 1 })),
		quietly(() => categoryService.getMegamenu())
	])
	const store: any = (layout as any)?.store ?? null
	const hasBlog = !!(blogs as any)?.data?.length
	const hasVendors = !!store?.plugins?.isMultiVendor?.active
	const topLevel = (Array.isArray(tree) ? tree : []).filter((c: any) => c?.slug)
	const examples = [topLevel[0]?.slug, topLevel[0]?.children?.[0]?.slug ?? topLevel[1]?.slug].filter(Boolean)

	const origin = event.url.origin
	const name = store?.name || event.url.host
	const description = stripHtml(store?.description) || `Online store at ${event.url.host}.`
	const currency = store?.currency?.code || store?.currencyCode || store?.currency
	const country = store?.country?.name || store?.country?.code

	const facts = [
		`- Store: ${name}`,
		`- Canonical origin: ${origin}`,
		currency ? `- Prices are quoted in ${String(currency).toUpperCase()}` : null,
		country ? `- Ships from: ${country}` : null
	].filter(Boolean)

	const body = `# ${name}

> ${description}

This file describes the storefront's structure for AI agents and crawlers.

${facts.join('\n')}

## Browse

- [Home](/)
- [All products](/products): the full catalogue, with search, filtering and pagination.
- [Collections](/collections): curated product groupings.
${hasVendors ? '- [Vendors](/vendors): brands and sellers stocked here.\n' : ''}${hasBlog ? '- [Blog](/blog): editorial and long-form content.\n' : ''}
Category listings live at the bare slug${examples.length ? ` — ${examples.map((slug) => `\`/${slug}\``).join(', ')} —` : ','} not under
\`/categories/\`. Paginate any listing with \`?page=N\` on the same path; that parameter is
crawlable, every other listing parameter is disallowed in robots.txt.

Individual products live at \`/products/<slug>\`${hasBlog ? ', blog posts at `/blog/<slug>`,' : ''} and CMS pages at
\`/p/<slug>\`. Product pages carry Product and BreadcrumbList structured data. Prices, stock and
availability change frequently — read them from the product page at request time rather than
relying on cached values.

## Buying

- [Cart](/checkout/cart)
- [Delivery address](/checkout/address)
- [Payment](/checkout/payment)

Checkout requires a session, is disallowed in robots.txt and is not useful to crawl. Please do not
attempt to submit these forms.

## Customer account

Everything under \`/my\` and \`/auth\` is authenticated or transactional. It holds no public content
and should not be crawled or indexed.

## Policies and company

- [About us](/about-us)
- [Contact us](/contact-us)
- [FAQs](/faqs)
- [Shipping policy](/shipping-policy)
- [Refund policy](/refund-policy)
- [Terms and conditions](/terms-and-conditions)
- [Privacy policy](/privacy-policy)

## Notes for agents

- [Sitemap](${origin}/sitemap.xml) is the authoritative list of indexable URLs.
- [robots.txt](${origin}/robots.txt) defines crawl rules and takes precedence over this file.
`

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	})
}
