import { describe, expect, it } from 'vitest'
import { guardStorePalette } from '$lib/components/common/store-palette-guard'
import { tripletToHex } from '$lib/composer/theme-tokens'

describe('guardStorePalette', () => {
	it('gives an unpaired dark primary a white label and keeps it as ink', () => {
		const out = guardStorePalette({ '--primary': 'hsl(222, 47%, 11%)' })
		expect(out['--primary-foreground']).toBe('0 0% 100%')
		expect(out['--primary-ink']).toBe('222 47% 11%')
	})

	it('gives an unpaired light primary a dark label and leaves its ink to the text colour', () => {
		const out = guardStorePalette({ '--primary': '47 100% 60%' })
		expect(out['--primary-foreground']).toBe('0 0% 10%')
		expect(out['--primary-ink']).toBeUndefined()
	})

	it("keeps the merchant's own label colour", () => {
		expect(guardStorePalette({ '--primary': '47 100% 60%', '--primary-foreground': '0 0% 100%' })['--primary-foreground']).toBe('0 0% 100%')
	})

	it('still raises an unpaired dark ground', () => {
		expect(guardStorePalette({ '--muted': '240 10% 70%' })['--muted']).toBe('240 10% 90%')
	})
})

describe('tripletToHex', () => {
	it('converts the storefront triplet back to hex', () => {
		expect(tripletToHex('0 0% 100%')).toBe('#ffffff')
		expect(tripletToHex('0 100% 50%')).toBe('#ff0000')
		expect(tripletToHex('47 100% 60%')).toBe('#ffd333')
		expect(tripletToHex('not a colour')).toBe('')
	})
})
