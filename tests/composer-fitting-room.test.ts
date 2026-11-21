import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/svelte'
import { fittingRoom, outfitFor } from '$lib/composer/helpers'
import { SECTIONS } from '$lib/composer/registry'
import FittingRoom from '$lib/composer/sections/FittingRoom.svelte'

vi.mock('$lib/components/product-catalogue/product-card.svelte', () => ({ default: () => {} }))

const products = [
	{ id: '1', title: 'Blue puffer', thumbnail: '/top1.webp' },
	{ id: '2', title: 'Red hoodie', thumbnail: '/top2.webp' },
	{ id: '3', title: 'Beige cargo', thumbnail: '/bottom1.webp' }
]
const section = (settings: Record<string, unknown>) => ({ id: 'f', type: 'fitting-room', settings, products })

describe('fitting room (D284)', () => {
	it('is drawn for the engine type', () => {
		expect(SECTIONS['fitting-room']).toBe(FittingRoom)
	})

	it('keeps the products on sale in the shop order, and only whole photographed pairs', () => {
		const room = fittingRoom(
			section({
				tops: [2, 404, 1],
				bottoms: [3],
				outfits: [
					{ image: '/o.webp', products: [3, 1] },
					{ image: '/half.webp', products: [1] },
					{ image: 'javascript:alert(1)', products: [2, 3] }
				]
			})
		)
		expect(room.tops.map((p) => p.id)).toEqual(['2', '1'])
		expect(room.outfits.map((o) => o.image)).toEqual(['/o.webp'])
		expect(outfitFor(room, products[0], products[2])?.image).toBe('/o.webp')
		expect(outfitFor(room, products[1], products[2])).toBeNull()
		expect(fittingRoom(section({ tops: 'nope' })).tops).toEqual([])
	})

	it('shows the photo for a photographed pair and the two pictures for any other', async () => {
		const { container, getByRole } = render(FittingRoom, {
			section: section({ tops: [1, 2], bottoms: [3], outfits: [{ image: '/o.webp', products: [1, 3] }] })
		})
		expect(container.querySelector('.fr__person')?.getAttribute('src')).toBe('/o.webp')
		await fireEvent.click(getByRole('button', { name: 'Red hoodie' }))
		expect(container.querySelector('.fr__person')).toBeNull()
		expect(getByRole('img', { name: 'Red hoodie with Beige cargo' })).toBeTruthy()
		expect(getByRole('button', { name: 'Red hoodie' }).getAttribute('aria-pressed')).toBe('true')
	})

	it('draws nothing without at least one top and one bottom', () => {
		const { container } = render(FittingRoom, { section: section({ tops: [1], bottoms: [] }) })
		expect(container.querySelector('.fr')).toBeNull()
	})
})
