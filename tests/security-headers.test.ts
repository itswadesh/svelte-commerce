import { describe, expect, it } from 'vitest'
import { frameAncestors, withSecurityHeaders } from '../src/lib/server/security-headers'

describe('withSecurityHeaders', () => {
	it('adds the headers a page has not set', () => {
		const res = withSecurityHeaders(new Response('<html>', { headers: { 'content-type': 'text/html' } }), "'self'")
		expect(res.headers.get('x-content-type-options')).toBe('nosniff')
		expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
		expect(res.headers.get('strict-transport-security')).toBe('max-age=31536000')
		expect(res.headers.get('permissions-policy')).toContain('camera=()')
		expect(res.headers.get('content-security-policy')).toBe("frame-ancestors 'self'")
	})

	it("keeps a preview page's own frame-ancestors", () => {
		const own = 'frame-ancestors https://admin.example.com'
		const res = withSecurityHeaders(new Response('', { headers: { 'content-security-policy': own } }), "'self'")
		expect(res.headers.get('content-security-policy')).toBe(own)
	})

	it('copies a response whose headers are immutable', async () => {
		const passed = Response.redirect('https://example.com/', 302)
		const res = withSecurityHeaders(passed, "'self'")
		expect(res.status).toBe(302)
		expect(res.headers.get('location')).toBe('https://example.com/')
		expect(res.headers.get('x-content-type-options')).toBe('nosniff')
	})
})

describe('frameAncestors', () => {
	it("lets the store's engine frame it", () => {
		expect(frameAncestors('https://admin.shopnx.in/')).toBe("'self' https://admin.shopnx.in")
		expect(frameAncestors(undefined)).toBe("'self'")
		expect(frameAncestors('not a url')).toBe("'self'")
	})
})
