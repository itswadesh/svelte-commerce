/**
 * Home-page inheritance for the "Refined Editorial" theme.
 *
 * The admin's Pages feature (`/dash/pages/<home page>`) lets a merchant curate a banner
 * **slider** (`desktopBanners` / `mobileBanners`) and any number of banner **grids**
 * (`sections`). The editorial theme owns the design, so those records never replace a
 * section — they only fill a slot the merchant has actually populated:
 *
 *   - slider present → the hero's single theme image becomes a slider
 *   - sections present → they render as extra tile bands in the theme's own tile styling
 *   - nothing configured → the theme's static content renders exactly as before
 *
 * Both are switched off per device with the standard `hiddenSections` flags
 * (`heroSlider`, `pageSections`) on the admin Theme page.
 *
 * The admin mirrors this file at kitcommerce-admin `src/lib/theme/page-inheritance.ts` so the
 * customizer preview resolves identically — change both together.
 */

/** Nullable throughout: these come straight out of a jsonb column the admin writes freely. */
export interface PageBanner {
	url?: string | null
	link?: string | null
	title?: string | null
	aspectRatio?: string | null
}

export interface PageSection {
	title?: string | null
	/** 'grid' lays the banners out in a grid; 'carousel' is a horizontal scroll row. */
	layout?: string | null
	/** The admin's editor is a binary mobile/desktop switch — tablet resolves as desktop. */
	screenType?: string | null
	itemsPerRow?: number | null
	isActive?: boolean | null
	banners?: PageBanner[] | null
}

/** The `home` page record as served by GET /api/pages/home. */
export interface HomePageRecord {
	desktopBanners?: PageBanner[] | null
	tabletBanners?: PageBanner[] | null
	mobileBanners?: PageBanner[] | null
	sections?: PageSection[] | null
}

export type ContentDevice = 'mobile' | 'tablet' | 'desktop'

/**
 * Recommended upload sizes per tier, surfaced in the admin's Pages editor. The storefront's
 * `<picture>` breakpoints and the slider's aspect ratios are derived from these, so changing
 * one means changing all three.
 */
export const BANNER_SIZES = {
	mobile: { w: 360, h: 190, maxWidth: 767 },
	tablet: { w: 1024, h: 320, maxWidth: 1199 },
	desktop: { w: 1500, h: 380, maxWidth: null }
} as const

/**
 * Which sets a device will accept, best first. A store that uploads only one set still gets a
 * banner everywhere; a store that skips the middle tier serves mobile artwork to tablets, as
 * that crops far better on a narrow-ish screen than a 1500px desktop strip would.
 */
const FALLBACK_ORDER: Record<ContentDevice, ContentDevice[]> = {
	mobile: ['mobile', 'tablet', 'desktop'],
	tablet: ['tablet', 'mobile', 'desktop'],
	desktop: ['desktop', 'tablet', 'mobile']
}

export interface HeroSlide {
	/** Desktop artwork (1500x380). */
	url: string
	/** Tablet artwork (1024x320); falls back through the cascade when not uploaded. */
	tabletUrl: string
	/** Mobile artwork (360x190); falls back through the cascade when not uploaded. */
	mobileUrl: string
	link: string
	title: string
}

export interface PageBand {
	title: string
	carousel: boolean
	/** Items per row, already clamped for the device. */
	columns: number
	/** CSS aspect-ratio for the band's tiles — uniform, so the grid never goes ragged. */
	aspect: string
	items: Array<{ url: string; link: string; title: string }>
}

const hasUrl = (banner?: PageBanner): banner is PageBanner & { url: string } =>
	!!banner && typeof banner.url === 'string' && banner.url.trim() !== ''

/**
 * '4:5' / '4x5' / '' → a CSS aspect-ratio. Real page data is inconsistent here: the admin
 * seeds '1:1', leaves '' when an image is pasted as a URL, and older rows have no field.
 */
export function bannerAspect(raw: unknown, fallback = '1 / 1'): string {
	const parts = String(raw ?? '')
		.replace('x', ':')
		.split(':')
	if (parts.length !== 2) return fallback
	const [w, h] = parts.map((p) => Number(p.trim()))
	return w > 0 && h > 0 ? `${w} / ${h}` : fallback
}

/**
 * The hero slider's slides, each carrying all three artworks so the markup can hand the choice
 * to the browser (`<picture>` + media queries) instead of picking in JS. That matters: picking
 * by device in JS means SSR emits one set and hydration swaps to the other, so the browser
 * downloads both — a phone would pay for the 1500px desktop banner it never shows.
 *
 * Slides are paired by index off the longest set, and every tier resolves through
 * FALLBACK_ORDER, so a store that uploaded one set gets a banner on every device and one that
 * skipped tablets serves them the mobile artwork.
 */
export function resolveHeroSlides(page: HomePageRecord | null | undefined): HeroSlide[] {
	const sets: Record<ContentDevice, Array<PageBanner & { url: string }>> = {
		mobile: (page?.mobileBanners ?? []).filter(hasUrl),
		tablet: (page?.tabletBanners ?? []).filter(hasUrl),
		desktop: (page?.desktopBanners ?? []).filter(hasUrl)
	}
	const count = Math.max(sets.mobile.length, sets.tablet.length, sets.desktop.length)
	/** The banner a device should use at slide `i`, walking its fallback chain. */
	const pick = (device: ContentDevice, i: number) =>
		FALLBACK_ORDER[device].map((tier) => sets[tier][i]).find(Boolean)

	const slides: HeroSlide[] = []
	for (let i = 0; i < count; i++) {
		const desktop = pick('desktop', i)
		const tablet = pick('tablet', i)
		const mobile = pick('mobile', i)
		if (!desktop || !tablet || !mobile) continue
		slides.push({
			url: desktop.url,
			tabletUrl: tablet.url,
			mobileUrl: mobile.url,
			// Link/title follow the same precedence, so whichever tier the merchant filled in wins.
			link: desktop.link?.trim() || tablet.link?.trim() || mobile.link?.trim() || '',
			title: desktop.title?.trim() || tablet.title?.trim() || mobile.title?.trim() || ''
		})
	}
	return slides
}

/**
 * The merchant's banner grids for a device. A section is skipped unless it is switched on,
 * targets this device, and has at least one image — the admin seeds every new section
 * inactive and with one blank banner row, so unconfigured sections must never reach the page.
 */
export function resolvePageBands(page: HomePageRecord | null | undefined, device: ContentDevice): PageBand[] {
	const target = device === 'mobile' ? 'mobile' : 'desktop'
	// Legacy rows predate the toggle and are treated as on; the admin writes it explicitly.
	return (page?.sections ?? [])
		.filter((section) => section?.isActive !== false)
		.filter((section) => (section?.screenType || 'desktop') === target)
		.map((section) => {
			const banners = (section?.banners ?? []).filter(hasUrl)
			const requested = Number(section?.itemsPerRow) || 2
			return {
				title: section?.title?.trim() || '',
				carousel: section?.layout === 'carousel',
				// A desktop section's 4-up grid would be unreadable on a phone, so the count is
				// capped per device rather than trusted verbatim.
				columns: Math.min(Math.max(Math.round(requested), 1), device === 'mobile' ? 3 : 6),
				aspect: bannerAspect(banners.find((b) => b.aspectRatio)?.aspectRatio),
				items: banners.map((banner) => ({
					url: banner.url,
					link: banner.link?.trim() || '',
					title: banner.title?.trim() || ''
				}))
			}
		})
		.filter((band) => band.items.length > 0)
}
