import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

// Safari left the card's one grid column to auto, sized it from the picture's aspect ratio and
// drew every card 33 million pixels tall inside a collection page's <li>: the grid looked empty
// (a store's support email, 22 Nov 2026). jsdom has no layout, so guard the rule that fixes it.
describe('default product card', () => {
	it('keeps its grid column as wide as the card', () => {
		const src = readFileSync('src/lib/theme/default/DefaultProductCard.svelte', 'utf8')
		const rule = src.match(/\n\t\.dpc \{[^}]*\}/)?.[0] ?? ''
		expect(rule).toContain('grid-template-columns: minmax(0, 1fr)')
	})
})
