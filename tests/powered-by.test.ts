import { describe, it, expect } from 'vitest'
import { footerCredit, platformCredit } from '$lib/components/common/powered-by'

describe('platformCredit', () => {
	it('credits ShopNx on a hosted store', () => {
		expect(platformCredit('acme.shopnx.in')?.label).toBe('Powered by ShopNx')
		expect(platformCredit('Demo.ShopNx.in')?.link).toMatch(/^https:\/\/shopnx\.in\//)
	})

	it('stays off everywhere else', () => {
		for (const host of [undefined, '', 'shopnx.in', 'admin.shopnx.in', 'primed.co.in', 'localhost', 'evilshopnx.in']) {
			expect(platformCredit(host)).toBeUndefined()
		}
	})
})

describe('footerCredit', () => {
	it('shows the ShopNx credit until the shop switches it off', () => {
		expect(footerCredit(undefined, 'acme.shopnx.in', null)?.label).toBe('Powered by ShopNx')
		expect(footerCredit(undefined, 'acme.shopnx.in', { powered_by: true })?.label).toBe('Powered by ShopNx')
		expect(footerCredit(undefined, 'acme.shopnx.in', { powered_by: false })).toBeUndefined()
	})

	it("keeps the store record's own credit whatever the switch says", () => {
		expect(footerCredit('Made by Acme', 'acme.shopnx.in', { powered_by: false })).toEqual({ label: 'Made by Acme' })
		expect(footerCredit({ label: 'X', link: 'https://x.test' }, 'primed.co.in', null)).toEqual({ label: 'X', link: 'https://x.test' })
		expect(footerCredit(undefined, 'primed.co.in', null)).toBeUndefined()
	})
})
