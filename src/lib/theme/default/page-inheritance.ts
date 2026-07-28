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
	mobileBanners?: PageBanner[] | null
	sections?: PageSection[] | null
}

export type ContentDevice = 'mobile' | 'tablet' | 'desktop'

export interface HeroSlide {
	/** Desktop artwork (1500x380). */
	url: string
	/** Mobile artwork (360x190); equal to `url` when the store only uploaded one set. */
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
 * The hero slider's slides, each carrying BOTH artworks so the markup can hand the choice to
 * the browser (`<picture>` + a media query) instead of picking in JS. That matters: picking by
 * device in JS means SSR emits one set and hydration swaps to the other, so the browser
 * downloads both — a phone would pay for the 1500px desktop banner it never shows.
 *
 * The two lists are paired by index off whichever is longer, and each side falls back to the
 * other when a store uploaded only one set (most do) — a hero with no image at all would be
 * worse than a slightly-wrong crop.
 */
export function resolveHeroSlides(page: HomePageRecord | null | undefined): HeroSlide[] {
	const mobile = (page?.mobileBanners ?? []).filter(hasUrl)
	const desktop = (page?.desktopBanners ?? []).filter(hasUrl)
	const count = Math.max(mobile.length, desktop.length)
	const slides: HeroSlide[] = []
	for (let i = 0; i < count; i++) {
		const d = desktop[i]
		const m = mobile[i]
		const url = d?.url ?? m?.url
		const mobileUrl = m?.url ?? d?.url
		if (!url || !mobileUrl) continue
		slides.push({
			url,
			mobileUrl,
			link: d?.link?.trim() || m?.link?.trim() || '',
			title: d?.title?.trim() || m?.title?.trim() || ''
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
