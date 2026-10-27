import { describe, expect, it, vi } from 'vitest'
import { resolveStorefrontTheme } from '$lib/theme/index.js'

vi.mock('$lib/theme/homepage-content.js', () => ({}))

describe('resolveStorefrontTheme', () => {
	it('uses the theme the backend names', () => {
		expect(resolveStorefrontTheme({ theme: { name: 'Wine' } })).toMatchObject({ name: 'wine', source: 'admin' })
		expect(resolveStorefrontTheme({ theme: 'lime' })).toMatchObject({ name: 'lime', source: 'admin' })
	})

	it('falls back to the default theme when the backend has no theme feature', () => {
		expect(resolveStorefrontTheme({ name: 'A Saleor store' })).toMatchObject({ name: 'default', source: 'default' })
		expect(resolveStorefrontTheme(undefined)).toMatchObject({ name: 'default', source: 'default' })
	})

	it('falls back to the default theme for a theme this build does not ship', () => {
		expect(resolveStorefrontTheme({ theme: { name: 'aurora' } })).toMatchObject({ name: 'default', source: 'default' })
	})
})
