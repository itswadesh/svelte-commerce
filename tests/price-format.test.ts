import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { shopperPrice } from '$lib/utils/price-text'

// The inputs are what kitcommerce-core's formatPrice writes for each amount.
describe('shopperPrice', () => {
	it('drops .00 from a whole amount and groups rupees the Indian way', () => {
		expect(shopperPrice('₹2799.00', 2799, 'INR')).toBe('₹2,799')
		expect(shopperPrice('₹12999.00', 12999, 'INR')).toBe('₹12,999')
		expect(shopperPrice('₹129999.00', 129999, 'INR')).toBe('₹1,29,999')
		expect(shopperPrice('₹10000000.00', 10000000, 'inr')).toBe('₹1,00,00,000')
	})

	it('keeps the paise when there are some', () => {
		expect(shopperPrice('₹499.50', 499.5, 'INR')).toBe('₹499.50')
		expect(shopperPrice('₹129999.99', 129999.99, 'INR')).toBe('₹1,29,999.99')
	})

	it('writes zero as a plain zero', () => {
		expect(shopperPrice('₹0.00', 0, 'INR')).toBe('₹0')
	})

	it('groups other currencies in threes and keeps the symbol and code where core put them', () => {
		expect(shopperPrice('$1234.50', 1234.5, 'USD')).toBe('$1,234.50')
		expect(shopperPrice('€129999.00', 129999, 'EUR')).toBe('€129,999')
		expect(shopperPrice('$12.00 AUD', 12, 'AUD')).toBe('$12 AUD')
		expect(shopperPrice('¥1200 JPY', 1200, 'JPY')).toBe('¥1,200 JPY')
		expect(shopperPrice('$1999.00', 1999, undefined)).toBe('$1,999')
	})

	it('leaves text it cannot read as it is', () => {
		expect(shopperPrice('$undefined', undefined, 'USD')).toBe('$undefined')
		expect(shopperPrice('₹NaN', Number.NaN, 'INR')).toBe('₹NaN')
		expect(shopperPrice('Free', 0, 'INR')).toBe('Free')
	})
})

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		return statSync(path).isDirectory() ? files(path) : /\.(svelte|ts)$/.test(name) ? [path] : []
	})
}

describe('price formatting', () => {
	it("goes through $lib/utils/price everywhere, so no price skips the shopper's format", () => {
		const direct = files('src')
			.filter((file) => !/^src[\\/]lib[\\/](core[\\/]|utils[\\/]price\.ts$)/.test(file))
			.filter((file) => /import \{[^}]*\bformatPrice\b[^}]*\} from '\$lib\/core\/utils/.test(readFileSync(file, 'utf8')))
		expect(direct).toEqual([])
	})
})
