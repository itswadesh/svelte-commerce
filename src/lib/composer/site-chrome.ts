/**
 * The header and footer a shop sets in GoCommerce's theme editor (ext/layouts, D131), drawn on
 * every page: the announcement strip and the menu across the header; the footer's columns, a few
 * words about the shop, the newsletter switch, social links and the copyright line.
 *
 * Read through the connector's `layoutService.getHeader()` and `getFooter()` (GoCommerce connector
 * 0.10.0 and later), which other backends and older connectors do not have: then there is nothing
 * set, and the header and footer are the storefront's own, exactly as before. Every setting is
 * plain text or a link through `safeHref`; an empty one leaves the storefront's own in its place.
 */
import { safeHref } from './helpers.js'
import { editorOrigin } from './editor-bridge.js'

export type ChromePart = 'header' | 'footer'

/** A menu as the store record carries it: `{ menuId, name, items: [{ name, link, items }] }`. */
export type ChromeMenuItem = { name?: string; link?: string; items?: ChromeMenuItem[] }
export type ChromeMenu = { menuId?: string; name?: string; items?: ChromeMenuItem[] }

/** The published header or footer, or a preview key's draft, with the menu it names already read. */
export type SiteChrome = {
	revision?: number
	preview: boolean
	settings: Record<string, unknown>
	menu: ChromeMenu | null
}
export type Chrome = { header: SiteChrome | null; footer: SiteChrome | null }

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export type HeaderView = {
	announcement: { text: string; link: string | null; everyPage: boolean } | null
	/** False when the shop hid the header menu: no menu row, no phone menu button. */
	menu: boolean
}

/**
 * What the header draws from its settings: the strip, when it is on and has something to say, and
 * the menu unless the shop hid it — a header saved before `hide_menu` existed keeps its menu.
 */
export function headerView(settings: Record<string, unknown> | null | undefined): HeaderView {
	const s = settings ?? {}
	const text = str(s.announcement_text)
	const menu = s.hide_menu !== true
	if (s.show_announcement !== true || !text) return { announcement: null, menu }
	return { announcement: { text, link: safeHref(s.announcement_link) || null, everyPage: s.announcement_pages !== 'home' }, menu }
}

/** The networks a footer links to, by the key the footer's marks are drawn under. */
const NETWORK_KEYS: Record<string, string> = {
	instagram: 'instagram',
	facebook: 'facebook',
	x: 'twitter',
	youtube: 'youtube',
	pinterest: 'pinterest',
	linkedin: 'linkedin',
	whatsapp: 'whatsapp',
	telegram: 'telegram'
}

export type SocialLink = { key: string; url: string }
export type FooterView = {
	/** The words beside the logo; null keeps the store's description. */
	about: string | null
	/** Whether the newsletter sign-up shows; null keeps the storefront's own rule. */
	newsletter: boolean | null
	/** Empty keeps the social links from the storefront's plugins. */
	social: SocialLink[]
	/** Null keeps the storefront's own line. */
	copyright: string | null
}

/** What the footer draws from its settings. */
export function footerView(settings: Record<string, unknown> | null | undefined): FooterView {
	const s = settings ?? {}
	const social: SocialLink[] = []
	for (const item of Array.isArray(s.social) ? s.social : []) {
		const key = NETWORK_KEYS[str((item as Record<string, unknown>)?.network)]
		const url = safeHref((item as Record<string, unknown>)?.url)
		// A social link leaves the store: a path is not one.
		if (key && /^https?:\/\//i.test(url)) social.push({ key, url })
	}
	return {
		about: str(s.about) || null,
		newsletter: typeof s.newsletter === 'boolean' ? s.newsletter : null,
		social,
		copyright: str(s.copyright) || null
	}
}

export type FooterColumn = { name: string; items: { name: string; link?: string }[] }

/**
 * A footer menu as columns: each top-level link with links under it is a column headed by its
 * title, and the top-level links with none under them share one more, with no heading. A heading
 * with nothing under it, and nothing to link to, is dropped.
 */
export function footerColumns(items: ChromeMenuItem[] | null | undefined): FooterColumn[] {
	const columns: FooterColumn[] = []
	const loose: FooterColumn['items'] = []
	for (const item of items ?? []) {
		const children = (item?.items ?? []).filter((c) => c?.name).map((c) => ({ name: c.name as string, link: c.link }))
		if (children.length) columns.push({ name: item.name ?? '', items: children })
		else if (item?.name && item.link) loose.push({ name: item.name, link: item.link })
	}
	if (loose.length) columns.push({ name: '', items: loose })
	return columns
}

/**
 * The footer's columns: the store's footer menu once it has links, since it is the shop's own words
 * for its footer, else the theme's built-in ones. It used to be the other way round, and a footer
 * menu edited in the panel changed nothing a shopper saw.
 */
export function shownFooterColumns<T>(menuColumns: T[], themeColumns: T[]): T[] {
	return menuColumns.length ? menuColumns : themeColumns
}

/**
 * The store with the header's and footer's menus standing in for its own `header` and `footer`
 * menus, which every part of the page that draws one reads by those ids. The connector already
 * reads the published choice into the store; this is how a preview's draft choice gets there.
 */
export function withChromeMenus<T extends { menu?: ChromeMenu[] } | null | undefined>(store: T, chrome: Chrome): T {
	const replace: Record<string, ChromeMenu> = {}
	if (chrome.header?.menu) replace.header = chrome.header.menu
	if (chrome.footer?.menu) replace.footer = chrome.footer.menu
	if (!store || !Object.keys(replace).length) return store
	const menus = [...(store.menu ?? [])]
	for (const [id, menu] of Object.entries(replace)) {
		const entry = { ...menu, menuId: id, items: menu.items ?? [] }
		const at = menus.findIndex((m) => m?.menuId === id)
		if (at >= 0) menus[at] = entry
		else menus.push(entry)
	}
	return { ...store, menu: menus }
}

export type ChromePreview = { page: ChromePart; key: string; editor: string | null }

/**
 * A preview of the header or the footer: the theme editor opens the home page with the part's key
 * and `preview_page` naming the part, since the key opens that part's draft and no page's.
 */
export function chromePreview(url: URL): ChromePreview | null {
	const page = url.searchParams.get('preview_page')
	const key = url.searchParams.get('preview')
	if ((page !== 'header' && page !== 'footer') || !key) return null
	return { page, key, editor: editorOrigin(url.searchParams.get('editor')) }
}

/** The settings of the part in a draft the panel posted, or null when it holds none. */
export function draftChromeSettings(
	doc: { sections?: { type?: string; settings?: unknown }[] } | null | undefined,
	page: ChromePart
): Record<string, unknown> | null {
	const section = (Array.isArray(doc?.sections) ? doc.sections : []).find((s) => s?.type === page)
	if (!section) return null
	const s = section.settings
	return s && typeof s === 'object' && !Array.isArray(s) ? (s as Record<string, unknown>) : {}
}

type ChromeHook = {
	getHeader?: (args?: { preview?: string }) => Promise<SiteChrome | null>
	getFooter?: (args?: { preview?: string }) => Promise<SiteChrome | null>
}

const TTL = 30_000
const MAX_HOSTS = 500
const cache = new Map<string, { at: number; value: Chrome }>()

async function part(hook: ChromeHook | undefined, page: ChromePart, preview: string | null): Promise<SiteChrome | null> {
	const fetchIt = page === 'header' ? hook?.getHeader : hook?.getFooter
	if (typeof fetchIt !== 'function') return null
	try {
		return (await fetchIt.call(hook, preview ? { preview } : {})) ?? null
	} catch {
		return null
	}
}

/**
 * The header and footer for a request: the published pair, kept for thirty seconds per host — the
 * engine's own cache time — or, for a preview, the draft of the part being previewed beside the
 * published other, read fresh. Reached with Reflect.get for the reason the home page's load gives.
 */
export async function fetchChrome(services: object, host: string, preview: ChromePreview | null, now = Date.now()): Promise<Chrome> {
	const hook = Reflect.get(services, 'layoutService') as ChromeHook | undefined
	if (!preview) {
		const hit = cache.get(host)
		if (hit && now - hit.at < TTL) return hit.value
	}
	const [header, footer] = await Promise.all([
		part(hook, 'header', preview?.page === 'header' ? preview.key : null),
		part(hook, 'footer', preview?.page === 'footer' ? preview.key : null)
	])
	const value = { header, footer }
	if (!preview) {
		cache.delete(host)
		cache.set(host, { at: now, value })
		if (cache.size > MAX_HOSTS) cache.delete(cache.keys().next().value as string)
	}
	return value
}

/** Forget every kept answer: for tests. */
export function forgetChrome() {
	cache.clear()
}
