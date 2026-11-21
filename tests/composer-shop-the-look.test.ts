import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { hexColor, lookItems } from '$lib/composer/helpers'
import { SECTIONS } from '$lib/composer/registry'
import ShopTheLook from '$lib/composer/sections/ShopTheLook.svelte'

vi.mock('$lib/components/product-catalogue/product-card.svelte', () => ({ default: () => {} }))

const section = (settings: Record<string, unknown>, products: any[] = []) => ({ id: 'l', type: 'shop-the-look', settings, products })

describe('shop the look line-up (D282)', () => {
	it('is drawn for the engine type', () => {
		expect(SECTIONS['shop-the-look']).toBe(ShopTheLook)
	})

	it('keeps looks with a picture, each with its own products in the shop order', () => {
		const looks = lookItems(
			section(
				{
					looks: [
						{ image: '/a.webp', name: 'Festive', products: [9, 7, 404] },
						{ name: 'No picture yet', products: [7] },
						{ image: 'javascript:alert(1)' },
						{ image: '/b.webp', products: [] }
					]
				},
				[{ id: '7' }, { id: '9' }]
			)
		)
		expect(looks.map((l) => l.image)).toEqual(['/a.webp', '/b.webp'])
		expect(looks[0].products.map((p) => p.id)).toEqual(['9', '7'])
		expect(looks[0].alt).toBe('Festive')
		expect(looks[1].label).toBe('Look 4')
		expect(lookItems(section({ looks: 'nope' }))).toEqual([])
	})

	it('reads a colour only as #rrggbb', () => {
		expect(hexColor('#F4efe8')).toBe('#F4efe8')
		expect(hexColor('red;background:url(x)')).toBe('')
	})

	it('draws nothing without a look to show', () => {
		const { container } = render(ShopTheLook, { section: section({ looks: [{ name: 'Empty' }] }) })
		expect(container.querySelector('section')).toBeNull()
	})

	it('picks the first look, and another when pressed', async () => {
		const { getAllByRole, container } = render(ShopTheLook, {
			section: section({
				looks: [
					{ image: '/a.webp', name: 'Festive' },
					{ image: '/b.webp', name: 'Office' }
				]
			})
		})
		const people = getAllByRole('button')
		expect(people.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false'])
		expect(container.querySelector('.stl__title')?.textContent).toBe('Festive')
		await fireEvent.click(people[1])
		flushSync()
		expect(people.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
		expect(container.querySelector('.stl__title')?.textContent).toBe('Office')
		const imgs = container.querySelectorAll('img')
		expect([...imgs].every((i) => i.getAttribute('width') && i.getAttribute('height'))).toBe(true)
		expect(imgs[1].getAttribute('loading')).toBe('lazy')
	})
})
