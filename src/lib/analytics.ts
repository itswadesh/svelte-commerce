// Site-level GA4 events that core's analytics helpers do not cover. They call window.gtag, which
// app.html always defines; ad-tags.ts hands each event on to the store's Google and ad tags where
// the cookie choice allows, and to nobody when none is on.

/**
 * GA4 generate_lead. Call it only after the server has accepted the form. The params carry the
 * form type and non-personal product context; never the visitor's name, email, phone or message.
 */
export function trackGenerateLead(formType: string, context: Record<string, string | undefined> = {}): void {
	if (typeof window === 'undefined') return
	const gtag = (window as any).gtag
	if (typeof gtag !== 'function') return
	const params: Record<string, string> = { form_type: formType }
	for (const [key, value] of Object.entries(context)) if (value) params[key] = value
	try {
		gtag('event', 'generate_lead', params)
	} catch {
		/* never let analytics break the form */
	}
}

/**
 * GA4 begin_checkout, with the basket as it stands. Nothing sent it before, so GA4's funnel had no
 * start; the ad tags hear it too (ad-tags.ts). Item ids are SKUs, as on every other shopping event.
 * Once per basket in a session: coming back to the address step, or reloading it, is the same
 * checkout.
 */
export function trackBeginCheckout(cart: Record<string, any> | null | undefined, currency?: string): void {
	if (typeof window === 'undefined') return
	const gtag = (window as any).gtag
	const lines: Record<string, any>[] = cart?.lineItems ?? []
	if (typeof gtag !== 'function' || !lines.length) return
	try {
		const key = `begin_checkout_${cart?.id ?? ''}`
		if (sessionStorage.getItem(key)) return
		sessionStorage.setItem(key, '1')
	} catch {
		/* storage blocked: send it */
	}
	try {
		gtag('event', 'begin_checkout', { currency, value: Number(cart?.subtotal) || 0, items: lines.map(cartItem) })
	} catch {
		/* never let analytics break checkout */
	}
}

const cartItem = (l: Record<string, any>) => ({
	item_id: l.sku || l.productId,
	item_name: l.name ?? l.title,
	price: Number(l.price) || 0,
	quantity: Number(l.qty) || 1
})

/**
 * GA4 view_cart, on the bag page, with the basket as it stands. Nothing sent it before; the ad tags
 * hear it too, and it is Criteo's basket event (ad-tags.ts).
 */
export function trackViewCart(cart: Record<string, any> | null | undefined, currency?: string): void {
	if (typeof window === 'undefined') return
	const gtag = (window as any).gtag
	const lines: Record<string, any>[] = cart?.lineItems ?? []
	if (typeof gtag !== 'function' || !lines.length) return
	try {
		gtag('event', 'view_cart', { currency, value: Number(cart?.subtotal) || 0, items: lines.map(cartItem) })
	} catch {
		/* never let analytics break the bag */
	}
}

/**
 * GA4 view_item_list, for a listing page's products in the order shown. Ids follow view_item's
 * (SKU, else the product id), so every tag matches a listed product to its page.
 */
export function trackViewItemList(products: Record<string, any>[] | null | undefined, listName: string, currency?: string): void {
	if (typeof window === 'undefined') return
	const gtag = (window as any).gtag
	if (typeof gtag !== 'function' || !products?.length) return
	try {
		gtag('event', 'view_item_list', {
			item_list_name: listName,
			currency,
			items: products.slice(0, 30).map((p, index) => ({
				item_id: p.sku ?? p.id,
				item_name: p.title ?? p.name,
				price: Number(p.price) || 0,
				index
			}))
		})
	} catch {
		/* never let analytics break the listing */
	}
}
