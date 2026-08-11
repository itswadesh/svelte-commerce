import { describe, expect, it } from 'vitest'
import { hasSessionCookie } from '$lib/core/utils/session-cookie'

describe('hasSessionCookie', () => {
	it('sees the me cookie first, middle and last', () => {
		expect(hasSessionCookie('me=%7B%22userId%22%3A%221%22%7D')).toBe(true)
		expect(hasSessionCookie('theme=dark; me=%7B%7D; lang=en')).toBe(true)
		expect(hasSessionCookie('lang=en; me=%7B%7D')).toBe(true)
	})

	it('is not fooled by cookies merely ending in "me"', () => {
		expect(hasSessionCookie('theme=dark')).toBe(false)
		expect(hasSessionCookie('storename=acme; welcome=1')).toBe(false)
	})

	it('treats a guest, a cleared cookie and an httpOnly-only session as signed out', () => {
		expect(hasSessionCookie('')).toBe(false)
		expect(hasSessionCookie('theme=dark; me=')).toBe(false)
		// connect.sid is httpOnly, so it never appears in document.cookie at all
		expect(hasSessionCookie('litekart_store_id=store_01')).toBe(false)
	})
})
