import type { RequestHandler } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'

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

export const GET: RequestHandler = async (event) => {
	let store: any = null
	try {
		store = (await layoutServer(event as any))?.store
	} catch {
		// Store lookup failed (bad domain mapping, upstream blip). Still serve a usable route
		// manifest rather than a 500 — the structure is correct regardless of the brand details.
	}

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
- [Vendors](/vendors): brands and sellers stocked here.
- [Blog](/blog): editorial and long-form content.

Category and term listings live at the bare slug — \`/pendant\`, \`/gold-ring\` — not under
\`/categories/\`. Paginate any listing with \`?page=N\` on the same path; that parameter is
crawlable, every other listing parameter is disallowed in robots.txt.

Individual products live at \`/products/<slug>\`, blog posts at \`/blog/<slug>\`, and CMS pages at
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
