// A store hosted on ShopNx (`acme.shopnx.in`) credits the platform in its footer, linking back to
// shopnx.in so shoppers can find where the store was made (owner, 2026-11-20). Other hosts — a
// self-hosted install, or a store on its own domain — get no credit unless their record names one.
// ponytail: a hosted store on its own domain is skipped; send `poweredBy` from the engine to cover it.
const LINK = 'https://shopnx.in/?utm_source=store&utm_medium=footer&utm_campaign=powered-by'

export function platformCredit(host: string | undefined): { label: string; link: string } | undefined {
	const h = (host ?? '').toLowerCase()
	if (h === 'shopnx.in' || !h.endsWith('.shopnx.in') || h.startsWith('admin.')) return undefined
	return { label: 'Powered by ShopNx', link: LINK }
}

type Credit = { label?: string; link?: string }

/**
 * The footer's credit: the store record's own `poweredBy` when it names one, else ShopNx's on a
 * hosted store — unless the shop switched "Powered by ShopNx" off in the theme editor's footer
 * (`powered_by`, owner 2026-11-20). Shared by the default footer and the Lime and Noor footers.
 */
export function footerCredit(poweredBy: unknown, host: string | undefined, footerSettings: Record<string, unknown> | null | undefined): Credit | undefined {
	if (typeof poweredBy === 'string') return { label: poweredBy }
	if (poweredBy && typeof poweredBy === 'object') return poweredBy as Credit
	return footerSettings?.powered_by === false ? undefined : platformCredit(host)
}
