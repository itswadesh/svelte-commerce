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
