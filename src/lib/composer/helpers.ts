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

/** A collection list's card, as the connector answers it. */
export type ComposerCollection = { id: string; title: string; slug?: string; link: string; image: string | null }

/** One section of a composed page, as the connector answers it. */
export type ComposerSection = {
	id: string
	type: string
	settings: Record<string, unknown>
	/** Product grids only: the grid's products, mapped like any other product card's. */
	products?: any[]
	/** Collection lists only: the collections the engine found, in the order picked. */
	collections?: ComposerCollection[]
}

export type ComposerLayout = {
	page: string
	theme?: string
	revision?: number
	/** The saved draft, shown through a preview key: never indexed. */
	preview?: boolean
	/** The design tokens published with the page (connector 0.8.0 and later). */
	themeSettings?: Record<string, unknown> | null
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

const record = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {})

export type Slide = { image: string; mobileImage: string; heading: string; text: unknown; buttonText: string; buttonLink: unknown }

/** A slideshow's slides that have a picture, at most eight, as the engine's schema allows. */
export function slideItems(value: unknown): Slide[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			const mobileImage = safeHref(item.mobile_image)
			return {
				image: safeHref(item.image) || mobileImage,
				mobileImage,
				heading: text(item, 'heading'),
				text: item.text,
				buttonText: text(item, 'button_text'),
				buttonLink: item.button_link
			}
		})
		.filter((slide) => slide.image)
		.slice(0, 8)
}

/** How long a slide stays when the slideshow moves by itself: three to ten seconds, five unless set. */
export function slideInterval(value: unknown): number {
	return intSetting(value, 3, 10, 5) * 1000
}

/** Questions that have both a question and an answer, at most thirty. */
export function faqItems(value: unknown): { question: string; answer: string }[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return { question: text(item, 'question'), answer: typeof item.answer === 'string' ? item.answer : '' }
		})
		.filter((item) => item.question && item.answer.trim())
		.slice(0, 30)
}

export type Column = { image: string; heading: string; text: unknown; linkText: string; link: string }

/** Columns that show something, at most four. */
export function columnItems(value: unknown): Column[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return {
				image: safeHref(item.image),
				heading: text(item, 'heading'),
				text: item.text,
				linkText: text(item, 'link_text'),
				link: safeHref(item.link)
			}
		})
		.filter((c) => c.image || c.heading || paragraphs(c.text).length)
		.slice(0, 4)
}

/** Tailwind classes for columns side by side from the tablet up; written out in full for the scanner. */
export function columnsClass(count: number): string {
	switch (Math.min(4, Math.max(1, count))) {
		case 1:
			return 'grid-cols-1'
		case 2:
			return 'grid-cols-1 md:grid-cols-2'
		case 3:
			return 'grid-cols-1 md:grid-cols-3'
		default:
			return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
	}
}

/** A collection list's cards: those with a title and a link on this site. */
export function collectionCards(section: ComposerSection): ComposerCollection[] {
	return (section.collections ?? [])
		.filter((c) => c && typeof c.title === 'string' && c.title.trim() && safeHref(c.link))
		.map((c) => ({ ...c, link: safeHref(c.link), image: safeHref(c.image) || null }))
		.slice(0, 12)
}

export type VideoEmbed = { kind: 'youtube' | 'vimeo'; id: string; embed: string }
export type VideoSource = VideoEmbed | { kind: 'file'; src: string }

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/
const VIMEO_ID = /^[0-9]{1,12}$/

const youtube = (id: string): VideoEmbed | null =>
	YOUTUBE_ID.test(id) ? { kind: 'youtube', id, embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` } : null
const vimeo = (id: string): VideoEmbed | null =>
	VIMEO_ID.test(id) ? { kind: 'vimeo', id, embed: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` } : null

/**
 * The player a YouTube or Vimeo address is for, and the embed to load once the shopper presses
 * play: youtube-nocookie.com, and Vimeo with do-not-track, so nothing is fetched from either
 * before then. The engine's VideoEmbed rule; anything else is null. The embed is built from the
 * id alone, so the address the merchant pasted never reaches a frame as written.
 */
export function videoEmbed(value: unknown): VideoEmbed | null {
	if (typeof value !== 'string') return null
	let url: URL
	try {
		url = new URL(value.trim())
	} catch {
		return null
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
	const host = url.hostname.toLowerCase().replace(/^www\./, '')
	const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')
	switch (host) {
		case 'youtube.com':
		case 'm.youtube.com':
		case 'youtube-nocookie.com':
			if (parts.length === 1 && parts[0] === 'watch') return youtube(url.searchParams.get('v') ?? '')
			if (parts.length === 2 && ['shorts', 'embed', 'live'].includes(parts[0])) return youtube(parts[1])
			return null
		case 'youtu.be':
			return parts.length === 1 ? youtube(parts[0]) : null
		case 'vimeo.com':
			return parts.length === 1 ? vimeo(parts[0]) : null
		case 'player.vimeo.com':
			return parts.length === 2 && parts[0] === 'video' ? vimeo(parts[1]) : null
	}
	return null
}

/** A video section's source: the link when it is a YouTube or Vimeo video, else the file. */
export function videoSource(settings: Record<string, unknown> | null | undefined): VideoSource | null {
	const embed = videoEmbed(settings?.video_url)
	if (embed) return embed
	const src = safeHref(settings?.video_file)
	return src ? { kind: 'file', src } : null
}
