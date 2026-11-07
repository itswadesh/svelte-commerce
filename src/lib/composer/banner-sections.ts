import type { ComposerLayout, ComposerSection } from './helpers.js'

type Banner = { url?: string | null; link?: string | null; title?: string | null }
type BannerPage = {
	desktopBanners?: Banner[] | null
	mobileBanners?: Banner[] | null
	sections?: { title?: string | null; screenType?: string | null; banners?: Banner[] | null }[] | null
} | null

/**
 * A composed home page with the store's banners on it. A hosted store always has a composed page,
 * its starting one included, and that page replaces the built-in home page that draws banners, so
 * a banner added in the panel would otherwise show nowhere. Slides go first and each grid after the
 * page's first section. A preview shows the draft as it is.
 *
 * ponytail: a tile uses its wide picture on a phone too, because the section has one picture per
 * column. Give multi-column a phone picture if a store's tiles crop badly.
 */
export function withBanners<T extends ComposerLayout | null | undefined>(layout: T, page: BannerPage): T {
	if (!layout?.sections?.length || layout.preview || !page) return layout
	const slides = (page.desktopBanners ?? []).filter((b) => b.url)
	const phone = page.mobileBanners ?? []
	const top: ComposerSection[] = slides.length
		? [
				{
					id: 'banner-slides',
					type: 'slideshow',
					settings: {
						slides: slides.map((b, i) => ({
							image: b.url,
							mobile_image: phone[i]?.url ?? b.url,
							heading: b.title ?? '',
							button_text: b.link ? 'Shop now' : '',
							button_link: b.link ?? ''
						}))
					}
				}
			]
		: []
	const grids: ComposerSection[] = (page.sections ?? [])
		.filter((g) => (g.screenType || 'desktop') === 'desktop' && g.banners?.some((b) => b.url))
		.map((g, i) => ({
			id: `banner-grid-${i}`,
			type: 'multi-column',
			settings: {
				style: 'tiles',
				heading: g.title ?? '',
				items: (g.banners ?? [])
					.filter((b) => b.url)
					.map((b) => ({ image: b.url, heading: b.title ?? '', link: b.link ?? '' }))
			}
		}))
	if (!top.length && !grids.length) return layout
	const [first, ...rest] = layout.sections
	return { ...layout, sections: [...top, first, ...grids, ...rest] }
}
