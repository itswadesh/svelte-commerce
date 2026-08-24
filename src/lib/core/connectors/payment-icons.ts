// A connector for a non-Litekart backend hands back a payment method with no icon: `/static/payment/
// <code>.<ext>` is served by the Litekart API, which such a store does not run, and only the
// storefront knows which marks it actually ships. So the icon is picked here, from `code`.
//
// Files in `static/` are published at the site root, so `static/payment/cod.svg` is
// `/payment/cod.svg`. Only marks we ship ourselves are mapped; every other method falls back to a
// neutral card icon rather than us inventing a payment brand's logo.

const SHIPPED_ICONS = new Set(['cod', 'card'])

const FALLBACK_ICON = '/payment/card.svg'

/** A payment method's `code` -> a path this storefront actually serves. */
export const localPaymentIcon = (method: { code?: string; img?: string | null } | null | undefined) => {
	const code = (method?.code || '').toLowerCase().replace(/[^a-z0-9-]/g, '')
	if (!code) return FALLBACK_ICON
	return SHIPPED_ICONS.has(code) ? `/payment/${code}.svg` : FALLBACK_ICON
}
