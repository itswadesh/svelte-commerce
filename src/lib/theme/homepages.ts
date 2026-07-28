import type { Component } from 'svelte'
import type { HomepageModule } from '$lib/core/composables/index.js'
import type { Banner, Category, Product } from '$lib/core/types/index.js'
import type { ThemeHomepageContent } from './types.js'
import type { PageSection } from './default/page-inheritance.js'
import DefaultHomepage from './default/DefaultHomepage.svelte'
import WineHomepage from './wine/WineHomepage.svelte'
import OrganicHomepage from './organic/OrganicHomepage.svelte'
import LimeHomepage from './lime/LimeHomepage.svelte'

/**
 * The prop contract every theme homepage is rendered with by `src/routes/(www)/+page.svelte`.
 *
 * Themes are switchable at runtime, so the registry below is the single place where the
 * homepage slot is typed: a theme may consume any subset of this contract, but it can never
 * require something the homepage route does not pass. `themeContent` carries the theme-owned
 * static copy/assets; everything else is live commerce data from the API.
 */
export interface ThemeHomepageProps {
	themeContent: ThemeHomepageContent
	brandName: string
	themeDescription: string
	storeLogo?: string
	storeName?: string
	storeDescription?: string
	aspectWidth: string
	aspectHeight: string
	featuredCategories: Category[]
	featuredProducts: Product[]
	filterButtons: string[]
	homepageModule: HomepageModule
	loading?: boolean
	desktopBanners?: Banner[]
	tabletBanners?: Banner[]
	mobileBanners?: Banner[]
	/** The admin `home` page's banner sections — see ./default/page-inheritance.ts. */
	pageSections?: PageSection[]
	currencyCode?: string
}

/**
 * Themes whose homepage is still a bespoke component.
 *
 * A theme that ships a `layout` from the API is rendered by `ThemeSections` instead and needs no
 * entry here — `noor` was the first to move. This registry shrinks as themes migrate.
 */
export const themeHomepages: Record<string, Component<ThemeHomepageProps>> = {
	default: DefaultHomepage,
	wine: WineHomepage,
	organic: OrganicHomepage,
	lime: LimeHomepage
}
