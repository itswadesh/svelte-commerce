import { describe, it, expect } from 'vitest'
import { platformCredit } from '$lib/components/common/powered-by'

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
