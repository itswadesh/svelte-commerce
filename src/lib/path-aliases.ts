// Pages a backend's own default menus link to under other names. GoCommerce gives every new store
// a header and footer pointing at /contact, /search and /pages/privacy, and a merchant who never
// edits them would otherwise ship a header whose Contact link is a 404.
const PAGES: Record<string, string> = {
	about: '/about-us',
	contact: '/contact-us',
	privacy: '/privacy-policy',
	terms: '/terms-and-conditions',
	shipping: '/shipping-policy',
	returns: '/refund-policy',
	refunds: '/refund-policy'
}

/** Where a path the storefront does not serve should go, or null when it is not an alias. */
export function aliasedPath(url: URL): string | null {
	const path = url.pathname.replace(/\/+$/, '') || '/'
	if (path === '/contact') return PAGES.contact
	if (path === '/search') {
		const q = url.searchParams.get('q') ?? url.searchParams.get('search')
		return q ? `/products?search=${encodeURIComponent(q)}` : '/products'
	}
	const page = /^\/pages\/([^/]+)$/.exec(path)?.[1]
	if (!page) return null
	if (PAGES[page]) return PAGES[page]
	if (Object.values(PAGES).includes(`/${page}`)) return `/${page}`
	return `/p/${encodeURIComponent(decodeURIComponent(page))}`
}

/**
 * Each link as the address that answers it. The engine lists a store's pages under its own
 * /pages/<slug> scheme, which this storefront answers with a redirect (/pages/returns is
 * /refund-policy), and a search engine reports a sitemap of redirects as errors rather than
 * following them.
 */
export function finalLocs(xml: string): string {
	return xml.replace(/<loc>([^<]+)<\/loc>/g, (whole, loc: string) => {
		try {
			const url = new URL(loc)
			const to = aliasedPath(url)
			return to ? `<loc>${url.origin}${to}</loc>` : whole
		} catch {
			return whole
		}
	})
}
