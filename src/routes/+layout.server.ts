import { layoutServer } from '$lib/core/load-functions/index.js'
import { getThemeHomepageContent, resolveStorefrontTheme } from '$lib/theme/index.js'

export async function load(event: any) {
	const data = await layoutServer(event)
	const theme = resolveStorefrontTheme(data?.store)

	/*
	 * The storefront API account is shared across the fleet, so `store.name` is the
	 * supplier's account name — not this storefront's brand. Anything that reads
	 * `page.data.store.name` (the SEO header's `og:site_name`, the side nav, page
	 * titles) would otherwise publish that name to customers and to crawlers.
	 *
	 * `store.logo` is the same leak in image form: the API serves the supplier's own
	 * logo file, and the surfaces that prefer a logo over a text wordmark — the
	 * sign-in / sign-up / forgot-password modals, which fall back to the wordmark only
	 * when there is no logo — therefore render the supplier's brand mark.
	 *
	 * The theme brand is authoritative for presentation, so both are substituted here,
	 * once, at the boundary — rather than patched surface by surface, which is how a
	 * previous store still leaked the account name into `og:site_name`. The store id
	 * (what the API is actually keyed on) is untouched.
	 */
	/*
	 * The account's CONTACT details are the same leak in its most damaging form: the
	 * shared account carries a REAL, UNRELATED business's phone, email and street
	 * address, and the app renders them as live `tel:` / `mailto:` links and publishes
	 * them in the Organization JSON-LD. A shopper here could call or email a company
	 * that has nothing to do with this storefront.
	 *
	 * They are blanked rather than swapped for a placeholder contact block: publishing
	 * a fabricated `tel:` / `mailto:` would be its own kind of lie, whereas an absent
	 * field is simply omitted from the schema. A theme's own contact page still renders
	 * its theme-owned block. Put the storefront's real details here once they exist.
	 *
	 * NOTE the field names: the real values live under `businessPhone` / `businessEmail`
	 * / `address_1`, NOT `phone` / `email` / `address`. Nulling only the obvious ones
	 * changes nothing.
	 */
	const brandName = getThemeHomepageContent(theme.name)?.brandName
	const store =
		brandName && data?.store
			? {
					...data.store,
					name: brandName,
					slug: null,
					logo: null,
					email: null,
					phone: null,
					mobile: null,
					address: null,
					address_1: null,
					address_2: null,
					businessPhone: null,
					businessEmail: null,
					businessName: null,
					businessLegalName: null,
					socialLinks: null
				}
			: data?.store

	return {
		...data,
		store,
		theme
	}
}
