/**
 * Headers every storefront response carries (owner standard, standards/security.md).
 *
 * No full Content-Security-Policy yet. SvelteKit's inline bootstrap, a store's own header scripts,
 * analytics and the payment SDKs each need an allowance nobody has tested, and a CSP once left the
 * admin panel rendering nothing. `frame-ancestors` is the one directive that touches none of them,
 * so it is sent alone. The theme editor's preview pages set their own (D126, D131), naming the
 * panel that framed them, and those are left as they are. Elsewhere the store may be framed by
 * itself and by its own engine, whose panel shows the storefront in a frame.
 *
 * No `includeSubDomains` on HSTS: a merchant's own domain may have subdomains this storefront knows
 * nothing about. Browsers ignore the header on plain HTTP, so local development is unaffected.
 *
 * The Permissions-Policy turns off only what no page uses. Embedded videos and payment frames need
 * the rest, so it does not list them.
 */
const FIXED: Record<string, string> = {
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'permissions-policy': 'camera=(), microphone=(), geolocation=(), usb=(), serial=(), hid=(), midi=(), display-capture=(), browsing-topics=()'
}

/** `'self'` plus the engine's origin when there is one. */
export function frameAncestors(engine: string | undefined): string {
	try {
		return engine ? `'self' ${new URL(engine).origin}` : "'self'"
	} catch {
		return "'self'"
	}
}

/** The response with the headers above, each only where the response has not set its own. */
export function withSecurityHeaders(response: Response, ancestors: string): Response {
	const add = (headers: Headers) => {
		for (const [name, value] of Object.entries(FIXED)) if (!headers.has(name)) headers.set(name, value)
		if (!headers.has('content-security-policy')) headers.set('content-security-policy', `frame-ancestors ${ancestors}`)
	}
	try {
		add(response.headers)
		return response
	} catch {
		// A response passed through from fetch() has immutable headers.
		const copy = new Response(response.body, response)
		add(copy.headers)
		return copy
	}
}
