// Connectors hand back an icon URL under `/static/payment/<code>.<ext>` — the path the Litekart API
// serves those images from, which `vite.config.ts` proxies there in dev. With no Litekart API behind
// the store that request dies (`http proxy error: static/payment/COD.png`) and the payment method
// renders a broken image. Serve them from this storefront instead: files in `static/` are published
// at the site root, so `static/payment/cod.svg` is `/payment/cod.svg`.
//
// Only marks we ship ourselves are mapped; every other method falls back to a neutral card icon
// rather than us inventing a payment brand's logo.

const SHIPPED_ICONS = new Set(['cod', 'card'])

const FALLBACK_ICON = '/payment/card.svg'

/** `/static/payment/COD.png` (or a bare code) -> a path this storefront actually serves. */
export const localPaymentIcon = (method: { code?: string; img?: string | null } | null | undefined) => {
	const code = (method?.code || '').toLowerCase().replace(/[^a-z0-9-]/g, '')
	if (!code) return FALLBACK_ICON
	return SHIPPED_ICONS.has(code) ? `/payment/${code}.svg` : FALLBACK_ICON
}

/** Rewrites the icon on every method in a connector's `{ data: [...] }` payment-method list. */
export const withLocalPaymentIcons = <T extends { data?: any[] }>(res: T): T => {
	if (!res?.data?.length) return res
	return {
		...res,
		data: res.data.map((method: any) => ({ ...method, img: localPaymentIcon(method) }))
	}
}
