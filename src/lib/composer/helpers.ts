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
export type ComposerCollection = { id: string; title: string; slug?: string; link: string; image: string | null; description?: string }

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
	// A browser reads `/\host` and `/<tab>/host` as `//host`, another site; a path keeps none of those.
	if (/^\/(?![/\\])[^\\\u0000-\u0020\u007f]*$/.test(href)) return href
	if (/^https?:\/\/[^\s]+$/i.test(href)) return href
	return ''
}

/** A whole number setting clamped to its range, or the fallback when it is not a number. */
export function intSetting(value: unknown, min: number, max: number, fallback: number): number {
	const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
	if (!Number.isFinite(n)) return fallback
	return Math.min(max, Math.max(min, Math.round(n)))
}

export function sectionDivider(settings: Record<string, unknown> | null | undefined): 'line' | 'band' | '' {
	const value = text(settings, 'divider')
	return value === 'line' || value === 'band' ? value : ''
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
 * The id of the section whose heading is the page's h1: the first hero or spotlight banner that has
 * a heading. Everything else is an h2. With neither, the composer renders a visually hidden h1
 * instead, so the page always has exactly one.
 */
export function pageHeadingSection(sections: ComposerSection[]): string | null {
	const hero = sections.find((s) => (s.type === 'hero' || s.type === 'spotlight') && text(s.settings, 'heading'))
	return hero ? hero.id : null
}

/** A select setting, or the fallback for anything that is not one of its choices. */
export function choice<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
	const v = typeof value === 'string' ? value.trim() : ''
	return (options as readonly string[]).includes(v) ? (v as T) : fallback
}

export type BentoTile = {
	image: string
	alt: string
	heading: string
	text: string
	linkText: string
	link: string
	tone: 'quiet' | 'accent' | 'dark'
}

/** A bento grid's tiles that show something, at most six. */
export function bentoTiles(value: unknown): BentoTile[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return {
				image: safeHref(item.image),
				alt: text(item, 'image_alt'),
				heading: text(item, 'heading'),
				text: text(item, 'text'),
				linkText: text(item, 'link_text'),
				link: safeHref(item.link),
				tone: choice(item.tone, ['quiet', 'accent', 'dark'], 'quiet')
			}
		})
		.filter((tile) => tile.image || tile.heading || tile.text)
		.slice(0, 6)
}

export type BentoSize = { w: number; h: number; widePhone: boolean }

// Each list fills a four-column grid exactly, whichever arrangement and however many tiles, so no
// count leaves a hole. Width and height, in the order the tiles come.
const BENTO: Record<'feature' | 'mosaic', [number, number][][]> = {
	feature: [
		[[4, 2]],
		[
			[2, 2],
			[2, 2]
		],
		[
			[2, 2],
			[2, 1],
			[2, 1]
		],
		[
			[2, 2],
			[2, 1],
			[1, 1],
			[1, 1]
		],
		[
			[2, 2],
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1]
		],
		[
			[2, 2],
			[2, 1],
			[1, 1],
			[1, 1],
			[2, 1],
			[2, 1]
		]
	],
	mosaic: [
		[[4, 2]],
		[
			[3, 2],
			[1, 2]
		],
		[
			[1, 2],
			[2, 2],
			[1, 2]
		],
		[
			[1, 2],
			[2, 1],
			[1, 2],
			[2, 1]
		],
		[
			[1, 2],
			[2, 1],
			[1, 2],
			[1, 1],
			[1, 1]
		],
		[
			[1, 2],
			[2, 1],
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1]
		]
	]
}

/**
 * Each tile's size on a computer, and on a phone's two columns whether it takes both: the first
 * always, and the last when it would otherwise stand alone.
 */
export function bentoSizes(count: number, layout: unknown): BentoSize[] {
	if (count < 1) return []
	const sizes = BENTO[choice(layout, ['feature', 'mosaic'], 'feature')][Math.min(count, 6) - 1]
	return sizes.map(([w, h], i) => ({ w, h, widePhone: i === 0 || (i === sizes.length - 1 && sizes.length % 2 === 0) }))
}

export type QuoteItem = { quote: string; name: string; detail: string; image: string; rating: number }

/** Quotes that have words, at most twelve. A rating is whole stars, 1 to 5; 0 is none shown. */
export function quoteItems(value: unknown): QuoteItem[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return {
				quote: text(item, 'quote'),
				name: text(item, 'name'),
				detail: text(item, 'detail'),
				image: safeHref(item.image),
				rating: item.rating === undefined || item.rating === null ? 0 : intSetting(item.rating, 1, 5, 0)
			}
		})
		.filter((item) => item.quote)
		.slice(0, 12)
}

/** Figures with both a value and what it counts, at most four: a bare number claims nothing. */
export function statItems(value: unknown): { value: string; label: string }[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => ({ value: text(record(raw), 'value'), label: text(record(raw), 'label') }))
		.filter((item) => item.value && item.label)
		.slice(0, 4)
}

/** Logos that have a picture, at most sixteen. */
export function logoItems(value: unknown): { image: string; name: string; link: string }[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return { image: safeHref(item.image), name: text(item, 'name'), link: safeHref(item.link) }
		})
		.filter((logo) => logo.image)
		.slice(0, 16)
}

/** A scrolling text's phrases, at most eight. */
export function phraseItems(value: unknown): string[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => text(record(raw), 'text'))
		.filter(Boolean)
		.slice(0, 8)
}

/** How long one pass takes: the same pace however much text, and never a blur for a short phrase. */
export function scrollSeconds(characters: number, speed: unknown): number {
	const perCharacter = { slow: 0.6, medium: 0.4, fast: 0.25 }[choice(speed, ['slow', 'medium', 'fast'], 'slow')]
	return Math.max(16, Math.round(characters * perCharacter))
}

/** A countdown's end as a time, or null for one unset or unreadable: then it draws nothing. */
export function countdownEnd(value: unknown): number | null {
	if (typeof value !== 'string' || !value.trim()) return null
	const at = Date.parse(value)
	return Number.isNaN(at) ? null : at
}

/** The time left, whole units; all zero once it has passed. */
export function countdownParts(end: number, now: number): { days: number; hours: number; minutes: number; seconds: number } {
	const left = Math.max(0, Math.floor((end - now) / 1000))
	return { days: Math.floor(left / 86400), hours: Math.floor(left / 3600) % 24, minutes: Math.floor(left / 60) % 60, seconds: left % 60 }
}

/**
 * The index of the first section that shows a picture, which loads with the page while every
 * later one waits. A product grid counts: with no hero picture above it, its first card is what
 * the shopper sees first. Only the first three sections qualify; anything lower starts off-screen.
 */
export function firstPictureSection(sections: ComposerSection[]): number {
	const index = sections.findIndex((s) => {
		const settings = s.settings ?? {}
		if (s.type === 'hero') return !!text(settings, 'heading') && !!(safeHref(settings.image) || safeHref(settings.mobile_image))
		if (s.type === 'slideshow') return slideItems(settings.slides).length > 0
		if (s.type === 'spotlight') return !!(safeHref(settings.image) || safeHref(settings.mobile_image))
		return s.type === 'product-grid' && !!s.products?.length
	})
	return index < 3 ? index : -1
}

/** Benefits items with a title, at most six, as the engine's schema allows; icon is a name from its set (D139). */
export function benefitItems(value: unknown): { title: string; body: string; icon: string }[] {
	if (!Array.isArray(value)) return []
	return value
		.map((item) => ({
			title: text(item as Record<string, unknown>, 'title'),
			body: typeof (item as Record<string, unknown>)?.body === 'string' ? ((item as Record<string, unknown>).body as string) : '',
			icon: text(item as Record<string, unknown>, 'icon')
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

export type Column = { image: string; video: string; heading: string; text: unknown; linkText: string; link: string }

/** Columns that show something, at most six. */
export function columnItems(value: unknown): Column[] {
	if (!Array.isArray(value)) return []
	return value
		.map((raw) => {
			const item = record(raw)
			return {
				image: safeHref(item.image),
				video: safeHref(item.video),
				heading: text(item, 'heading'),
				text: item.text,
				linkText: text(item, 'link_text'),
				link: safeHref(item.link)
			}
		})
		.filter((c) => c.image || c.video || c.heading || paragraphs(c.text).length)
		.slice(0, 6)
}

export type ColumnLook = 'columns' | 'tiles' | 'captioned'

export function columnLook(settings: Record<string, unknown> | null | undefined, columns: Column[]): ColumnLook {
	if (text(settings, 'style') === 'captioned') return 'captioned'
	return columns.every((c) => !paragraphs(c.text).length && c.link && (c.heading || c.linkText)) ? 'tiles' : 'columns'
}

// Written out in full so Tailwind's scanner keeps every one of them.
const COLUMN_CLASSES: Record<ColumnLook, string[]> = {
	columns: [
		'grid-cols-1',
		'grid-cols-1 md:grid-cols-2',
		'grid-cols-1 md:grid-cols-3',
		'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
		'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
	],
	tiles: [
		'grid-cols-1',
		'grid-cols-2',
		'grid-cols-2 md:grid-cols-3',
		'grid-cols-2 lg:grid-cols-4',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
	],
	captioned: [
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
		'grid-cols-2 md:grid-cols-4',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
		'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
	]
}

export function columnsClass(count: number, look: ColumnLook = 'columns'): string {
	return COLUMN_CLASSES[look][Math.min(6, Math.max(1, count)) - 1]
}

/** A collection list's cards: those with a title and a link on this site. */
export function collectionCards(section: ComposerSection): ComposerCollection[] {
	return (section.collections ?? [])
		.filter((c) => c && typeof c.title === 'string' && c.title.trim() && safeHref(c.link))
		.map((c) => ({ ...c, link: safeHref(c.link), image: safeHref(c.image) || null, description: text(c, 'description') }))
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
