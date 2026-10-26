/**
 * Pure helpers for the homepage composer: everything a section decides that does not need a
 * component, so it can be tested without rendering one.
 *
 * A composed page comes from the engine's `ext/layouts` through the connector's
 * `layoutService.getHomeLayout()`. Its settings are the merchant's, already validated by the
 * engine — plain text, never HTML, and links that are `/path` or `http(s)://` — but this side
 * still reads them defensively: a layout is data, and a value of the wrong shape must cost one
 * field, never the page.
 */

/** One section of a composed page, as the connector answers it. */
export type ComposerSection = {
	id: string
	type: string
	settings: Record<string, unknown>
	/** Product grids only: the grid's products, mapped like any other product card's. */
	products?: any[]
}

export type ComposerLayout = {
	page: string
	theme?: string
	revision?: number
	/** The saved draft, shown through a preview key: never indexed. */
	preview?: boolean
	sections: ComposerSection[]
}

/** A setting as display text: trimmed, and '' for anything that is not a string. */
export function text(settings: Record<string, unknown> | null | undefined, key: string): string {
	const value = settings?.[key]
	return typeof value === 'string' ? value.trim() : ''
}

/**
 * Plain text as paragraphs: a blank line starts a new one. Single line breaks stay inside their
 * paragraph (the component renders them with `white-space: pre-line`), because a merchant who
 * typed an address or a short list meant those breaks.
 */
export function paragraphs(value: unknown): string[] {
	if (typeof value !== 'string') return []
	return value
		.replace(/\r\n?/g, '\n')
		.split(/\n[ \t]*\n+/)
		.map((p) => p.trim())
		.filter(Boolean)
}

/**
 * A link the page may render: a path on this site or an http(s) address. The engine refuses
 * anything else on save; this is the second lock, so a `javascript:` value can never reach an
 * href even from a layout written before that rule.
 */
export function safeHref(value: unknown): string {
	if (typeof value !== 'string') return ''
	const href = value.trim()
	if (href.startsWith('/') && !href.startsWith('//')) return href
	if (/^https?:\/\/[^\s]+$/i.test(href)) return href
	return ''
}

/** A whole number setting clamped to its range, or the fallback when it is not a number. */
export function intSetting(value: unknown, min: number, max: number, fallback: number): number {
	const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
	if (!Number.isFinite(n)) return fallback
	return Math.min(max, Math.max(min, Math.round(n)))
}

/**
 * Tailwind classes for a product grid's desktop columns. Phones always show two across; the
 * classes are written out in full so Tailwind's scanner keeps every one of them.
 */
export function gridColumnsClass(columns: unknown): string {
	switch (intSetting(columns, 2, 4, 4)) {
		case 2:
			return 'grid-cols-2'
		case 3:
			return 'grid-cols-2 md:grid-cols-3'
		default:
			return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
	}
}

/**
 * The sections this build can render, in order. An unknown type — a layout authored against a
 * newer engine — is skipped with a warning in development, never thrown: the rest of the page
 * still renders.
 */
export function knownSections<T extends { type: string }>(
	sections: T[] | null | undefined,
	registry: Record<string, unknown>,
	warn?: (message: string) => void
): T[] {
	return (sections ?? []).filter((section) => {
		const known = !!section && Object.prototype.hasOwnProperty.call(registry, section.type)
		if (!known) warn?.(`[composer] unknown section type "${section?.type}" — skipped`)
		return known
	})
}

/**
 * The id of the section whose heading is the page's h1: the first hero that has a heading.
 * Everything else is an h2. With no hero, the composer renders a visually hidden h1 instead, so
 * the page always has exactly one.
 */
export function pageHeadingSection(sections: ComposerSection[]): string | null {
	const hero = sections.find((s) => s.type === 'hero' && text(s.settings, 'heading'))
	return hero ? hero.id : null
}

/** Benefits items with a title, at most six, as the engine's schema allows. */
export function benefitItems(value: unknown): { title: string; body: string }[] {
	if (!Array.isArray(value)) return []
	return value
		.map((item) => ({
			title: text(item as Record<string, unknown>, 'title'),
			body: typeof (item as Record<string, unknown>)?.body === 'string' ? ((item as Record<string, unknown>).body as string) : ''
		}))
		.filter((item) => item.title)
		.slice(0, 6)
}
