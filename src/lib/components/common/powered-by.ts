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
