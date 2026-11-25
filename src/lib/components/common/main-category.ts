// The main (top-level) category a shopper was last browsing, for the back buttons on the search
// results and on a product. Kept in a session cookie rather than sessionStorage so the server can
// render the search page's button in its first HTML: one that appeared on hydration would push the
// whole grid down.

export type MainCategory = { name: string; slug: string }

type Node = { name?: string; title?: string; slug?: string; link?: string; children?: Node[]; items?: Node[] }

export const MAIN_CATEGORY_COOKIE = 'main_category'

// A slug ends up in an href. Anything that could leave the store (`//evil`, `a/../..`, `http:`) is
// not a category of ours.
const safeSlug = (slug: unknown) => {
	const s = String(slug ?? '').trim()
	return s && !/[/\\:?#]/.test(s) ? s : ''
}

// Menu entries carry a link (/women) where category nodes carry a slug.
const slugOf = (n: Node | undefined) => safeSlug(n?.slug) || safeSlug(/^\/([^/?#]+)\/?$/.exec(n?.link ?? '')?.[1])

const named = (n: Node | undefined): MainCategory | null => {
	const name = String(n?.name ?? n?.title ?? '').trim()
	const slug = slugOf(n)
	return name && slug ? { name, slug } : null
}

/** A listing's main category: the top of its category trail, which the engine sends root first. */
export function mainOfTrail(trail: unknown): MainCategory | null {
	return Array.isArray(trail) ? named(trail[0]) : null
}

/** The top-level entry of a category tree (or header menu) that holds `slug`; null when none does. */
export function mainInTree(tree: unknown, slug: string): MainCategory | null {
	if (!Array.isArray(tree) || !slug) return null
	const holds = (n: Node, depth: number): boolean =>
		depth < 6 && (slugOf(n) === slug || (n?.children ?? n?.items ?? []).some((c) => holds(c, depth + 1)))
	const top = (tree as Node[]).find((n) => holds(n, 0))
	return named(top)
}

export type AppHeader = { title: string; href: string; label: string }

/**
 * The app-style header of a listing on a phone or in the app: "← <title>", where back goes up one
 * level and never out of the store. A category goes to its parent, a main category home. Search
 * results are titled with the query and go to the main category last browsed; with none
 * remembered the page keeps the ordinary header rather than inventing a destination. Null for
 * every other page.
 */
export function appHeaderFor(routeId: string | null | undefined, url: URL, trail: unknown, remembered: MainCategory | null): AppHeader | null {
	if (routeId === '/(www)/products') {
		const query = url.searchParams.get('search')?.trim()
		if (!query || !remembered) return null
		return { title: `“${query}”`, href: `/${remembered.slug}`, label: `Back to ${remembered.name}` }
	}
	if (routeId === '/(www)/[slug]' && Array.isArray(trail)) {
		const crumbs = trail.map((c) => named(c)).filter((c): c is MainCategory => !!c)
		const here = crumbs.at(-1)
		if (!here) return null
		const up = crumbs.at(-2)
		return { title: here.name, href: up ? `/${up.slug}` : '/', label: up ? `Back to ${up.name}` : 'Back to home' }
	}
	return null
}

/** The cookie line that remembers `category` until the browser session ends. */
export const mainCategoryCookie = (category: MainCategory) =>
	`${MAIN_CATEGORY_COOKIE}=${encodeURIComponent(JSON.stringify(category))}; path=/; SameSite=Lax`

/** The remembered category from the cookie's (decoded) value; null when absent or not ours. */
export function parseMainCategory(value: string | null | undefined): MainCategory | null {
	if (!value) return null
	try {
		return named(JSON.parse(value))
	} catch {
		return null
	}
}

/** The remembered category from a whole `document.cookie` string. */
export function mainCategoryFromCookies(cookies: string): MainCategory | null {
	const raw = cookies
		.split(/;\s*/)
		.find((c) => c.startsWith(`${MAIN_CATEGORY_COOKIE}=`))
		?.slice(MAIN_CATEGORY_COOKIE.length + 1)
	try {
		return raw ? parseMainCategory(decodeURIComponent(raw)) : null
	} catch {
		return null
	}
}
