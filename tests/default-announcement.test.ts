import { describe, expect, it } from 'vitest'
import { defaultContent } from '$lib/theme/default/homepage-content'

describe('default theme content', () => {
	it('draws no announcement strip until the shop writes one', () => {
		expect(defaultContent.header?.announcement).toBe('')
	})
})
