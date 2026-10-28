import { describe, it, expect } from 'vitest'
import { reviewReturnPath } from '../src/lib/utils/review-return'

describe('reviewReturnPath', () => {
	it('returns to the product with the review form flagged', () => {
		expect(reviewReturnPath(new URL('https://shop.test/products/ring?variant=2'))).toBe('/products/ring?variant=2&review=1#reviews')
	})

	it('drops auth params so the modal does not reopen', () => {
		expect(reviewReturnPath(new URL('https://shop.test/products/ring?show_auth=true&login=true&redirect=%2Fx'))).toBe(
			'/products/ring?review=1#reviews'
		)
	})

	it('never yields a protocol-relative path', () => {
		expect(reviewReturnPath(new URL('https://shop.test//evil.com/products/ring'))).toBe('/evil.com/products/ring?review=1#reviews')
	})
})
