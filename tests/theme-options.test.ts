import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME_OPTIONS, themeOptions } from '$lib/composer/theme-options'
import { DENSITIES, TYPE_SCALES, themeTokenDeclarations } from '$lib/composer/theme-tokens'

describe('themeOptions', () => {
	it("takes the storefront's own choices when the store set nothing", () => {
		expect(themeOptions(null)).toEqual(DEFAULT_THEME_OPTIONS)
		expect(themeOptions({}).list_columns_desktop).toBe('five')
		expect(themeOptions({}).pdp_low_stock_at).toBe(5)
	})

	it("uses each setting the store made, from its list", () => {
		const o = themeOptions({
			card_badge: 'none',
			card_vendor: false,
			card_title_lines: 'two',
			card_add_to_cart: true,
			list_columns_mobile: 'one',
			list_columns_desktop: 'three',
			list_filters_desktop: 'drawer',
			pdp_gallery: 'grid',
			pdp_low_stock_at: 0,
			pdp_size_guide: '/pages/size-guide'
		})
		expect(o).toMatchObject({
			card_badge: 'none',
			card_vendor: false,
			card_title_lines: 'two',
			card_add_to_cart: true,
			list_columns_mobile: 'one',
			list_columns_desktop: 'three',
			list_filters_desktop: 'drawer',
			pdp_gallery: 'grid',
			pdp_low_stock_at: 0,
			pdp_size_guide: '/pages/size-guide'
		})
	})

	it('drops anything outside the lists, so a value can only pick, never write', () => {
		const o = themeOptions({
			card_badge: 'bestseller',
			card_vendor: 'yes',
			list_columns_desktop: 6,
			pdp_low_stock_at: 50,
			pdp_size_guide: 'https://elsewhere.example/size'
		})
		expect(o.card_badge).toBe('first_tag')
		expect(o.card_vendor).toBe(true)
		expect(o.list_columns_desktop).toBe('five')
		expect(o.pdp_low_stock_at).toBe(5)
		expect(o.pdp_size_guide).toBe('')
		expect(themeOptions({ pdp_size_guide: '//elsewhere.example' }).pdp_size_guide).toBe('')
		expect(themeOptions({ pdp_size_guide: '/size"><script>' }).pdp_size_guide).toBe('')
		expect(themeOptions({ pdp_low_stock_at: 2.5 }).pdp_low_stock_at).toBe(5)
	})
})

describe('type, weight, density and sale settings', () => {
	it('sets the whole role ladder from one type_scale', () => {
		const d = themeTokenDeclarations({ type_scale: 'compact', heading_weight: 'semibold', density: 'spacious' })
		expect(d['--text-body']).toBe('0.875rem')
		expect(d['--text-caption']).toBe('0.75rem')
		expect(d['--heading-weight']).toBe('600')
		expect(d['--section-gap']).toBe(DENSITIES.spacious['--section-gap'])
		expect(themeTokenDeclarations({ type_scale: 'huge', heading_weight: '900', density: 'tight' })).toEqual({})
	})

	it('darkens a sale colour until it reads as text on the page', () => {
		expect(themeTokenDeclarations({ sale: '#15803d' })['--sale']).toBe('142.4 71.8% 29.2%')
		// #86efac is 1.4:1 on white; the same green, darker, until it is 4.5:1.
		expect(themeTokenDeclarations({ sale: '#86efac' })['--sale']).toBe('141.6 77% 29%')
	})

	it("keeps src/app.css's defaults equal to the standard scale and the compact density", () => {
		const css = readFileSync('src/app.css', 'utf8')
		for (const [name, value] of Object.entries({ ...TYPE_SCALES.standard, ...DENSITIES.compact })) {
			expect(css, name).toContain(`${name}: ${value};`)
		}
	})
})
