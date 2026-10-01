import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { cubicIn, cubicOut } from 'svelte/easing'
import { FALLBACK_MS, motionMs, fade, fly, slide, scale, drawer, prefersReducedMotion } from '$lib/motion'

const reduce = (on: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({
		matches: on && query.includes('reduce'),
		media: query,
		addListener() {},
		removeListener() {},
		addEventListener() {},
		removeEventListener() {}
	}))

afterEach(() => vi.unstubAllGlobals())

const node = () => document.createElement('div')
const out = { direction: 'out' as const }

describe('motion tokens', () => {
	it('mirror the values in src/app.css', () => {
		const css = readFileSync('src/app.css', 'utf8')
		for (const [token, ms] of Object.entries(FALLBACK_MS)) {
			expect(css).toMatch(new RegExp(`--motion-${token}:\\s*${ms}ms;`))
		}
	})

	it('fall back when the stylesheet cannot be read', () => {
		expect(motionMs('panel')).toBe(220)
	})
})

describe('transitions, full motion', () => {
	it('fade defaults to fast, and fast elements exit at fast', () => {
		reduce(false)
		expect(fade(node()).duration).toBe(150)
		expect(fade(node()).easing).toBe(cubicOut)
		expect(fade(node(), {}, out).duration).toBe(150)
		expect(fade(node(), {}, out).easing).toBe(cubicIn)
	})

	it('panel-length transitions exit at --motion-exit', () => {
		reduce(false)
		expect(fly(node(), { y: 24 }).duration).toBe(220)
		expect(fly(node(), { y: 24 }, out).duration).toBe(160)
		expect(drawer(node(), { edge: 'left' }, out).duration).toBe(160)
	})

	it('an explicit duration wins', () => {
		reduce(false)
		expect(fly(node(), { duration: 180 }).duration).toBe(180)
	})

	it('fly moves by transform only', () => {
		reduce(false)
		const css = fly(node(), { y: 24 }).css!(0, 1)
		expect(css).toContain('translate(0px, 24px)')
		expect(css).not.toMatch(/height|width|top|left:/)
	})

	it('slide never interpolates height', () => {
		reduce(false)
		const css = slide(node()).css!(0.5, 0.5)
		expect(css).toContain('translateY(-2px)')
		expect(css).not.toContain('height')
	})

	it('drawer translates from its edge', () => {
		reduce(false)
		expect(drawer(node(), { edge: 'right' }).css!(0, 1)).toContain('translateX(100%)')
		expect(drawer(node(), { edge: 'left' }).css!(0, 1)).toContain('translateX(-100%)')
		expect(drawer(node(), { edge: 'bottom' }).css!(0, 1)).toContain('translateY(100%)')
	})

	it('scale starts at .96 by default', () => {
		reduce(false)
		expect(scale(node()).css!(0, 1)).toContain('scale(0.96)')
	})
})

describe('transitions, reduced motion', () => {
	it('fly, slide, scale and drawer become fades of the same, non-zero duration', () => {
		reduce(true)
		for (const config of [fly(node(), { y: 24 }), slide(node()), drawer(node(), { edge: 'right' })]) {
			expect(config.duration).toBe(220)
			expect(config.css!(0.5, 0.5)).not.toContain('transform')
			expect(config.css!(0.5, 0.5)).toContain('opacity')
		}
		expect(scale(node()).duration).toBe(150)
		expect(scale(node()).css!(0.5, 0.5)).not.toContain('transform')
	})

	it('reads the reduced-motion setting live', () => {
		reduce(false)
		expect(prefersReducedMotion.current).toBe(false)
		reduce(true)
		expect(prefersReducedMotion.current).toBe(true)
		expect(fly(node(), { y: 24 }).css!(0, 1)).not.toContain('transform')
	})

	it('is false where matchMedia does not exist (SSR)', () => {
		vi.stubGlobal('matchMedia', undefined)
		expect(prefersReducedMotion.current).toBe(false)
	})
})
