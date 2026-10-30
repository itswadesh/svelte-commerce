// Site-level GA4 events that core's analytics helpers do not cover. They read window.gtag at call
// time (defined by the GoogleAnalytics loader in the root layout, driven by the store's
// googleTagManager plugin) and are a safe no-op when analytics is off.

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
		gtag('event', 'begin_checkout', {
			currency,
			value: Number(cart?.subtotal) || 0,
			items: lines.map((l) => ({
				item_id: l.sku || l.productId,
				item_name: l.name ?? l.title,
				price: Number(l.price) || 0,
				quantity: Number(l.qty) || 1
			}))
		})
	} catch {
		/* never let analytics break checkout */
	}
}
