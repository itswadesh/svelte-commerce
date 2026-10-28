import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import { benefitItems } from '$lib/composer/helpers'
import { benefitIcon } from '$lib/composer/benefit-icons'
import Benefits from '$lib/composer/sections/Benefits.svelte'

// The engine's fixed set (gocommerce ext/layouts BenefitIcons, D139).
const ENGINE_ICONS = [
	'truck', 'return', 'exchange', 'shield', 'lock', 'headset', 'phone', 'cash', 'wallet', 'percent',
	'gift', 'package', 'clock', 'star', 'award', 'verified', 'sparkle', 'leaf', 'heart', 'map-pin'
]

describe('benefit icons', () => {
	it('draws every icon the engine offers', () => {
		for (const key of ENGINE_ICONS) expect(benefitIcon(key), key).toBeTruthy()
	})

	it('draws nothing for a name it does not know, or none', () => {
		expect(benefitIcon('rocket')).toBeNull()
		expect(benefitIcon('')).toBeNull()
		expect(benefitIcon(undefined)).toBeNull()
		expect(benefitIcon('toString')).toBeNull()
	})

	it('keeps an item icon name, and none when it is not text', () => {
		expect(benefitItems([{ title: 'A', icon: 'truck' }, { title: 'B', icon: 3 }])).toEqual([
			{ title: 'A', body: '', icon: 'truck' },
			{ title: 'B', body: '', icon: '' }
		])
	})

	it('puts a hidden picture beside the benefits that have a known icon', () => {
		const { container } = render(Benefits, {
			section: {
				id: 'b',
				type: 'benefits',
				settings: { items: [{ title: 'Fast', icon: 'truck' }, { title: 'Odd', icon: 'rocket' }, { title: 'Plain' }] }
			}
		})
		const items = container.querySelectorAll('li')
		expect(items).toHaveLength(3)
		const svg = items[0].querySelector('svg')
		expect(svg?.getAttribute('aria-hidden')).toBe('true')
		expect(items[1].querySelector('svg')).toBeNull()
		expect(items[2].querySelector('svg')).toBeNull()
		expect(items[0].textContent).toContain('Fast')
	})
})
