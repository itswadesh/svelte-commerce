import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { page } from '$app/state'
import { autoMarked, type BagOffer } from '$lib/product/upsells'

const offers = vi.hoisted(() => ({ rows: [] as BagOffer[] }))
vi.mock('$lib/core/services', () => ({ cartService: { getOffers: async () => offers.rows } }))
vi.mock('$lib/core/utils', () => ({
	formatPrice: (n: number) => `₹${n.toFixed(2)}`,
	cn: (...classes: unknown[]) => classes.filter(Boolean).join(' ')
}))
// jsdom has no Web Animations.
vi.mock('$lib/motion', () => ({ slide: () => ({ duration: 0 }) }))

const { default: CartOffers } = await import('$lib/components/cart/cart-offers.svelte')

const offer = (over: Partial<BagOffer>): BagOffer => ({
	code: 'HELLO5',
	title: '5% off',
	isPercent: true,
	value: 5,
	minAmount: null,
	applies: true,
	amount: 50,
	remaining: null,
	...over
})

beforeEach(() => {
	page.data = { store: { currency: { code: 'INR' } } }
})

describe("the bag's automatic offers", () => {
	it('say they apply at checkout instead of offering Apply, until a code is typed', async () => {
		offers.rows = [offer({ code: 'AUTO10', title: '10% off', value: 10, amount: 100, autoApply: true }), offer({})]
		const { unmount } = render(CartOffers, { subtotal: 1000, applied: '', apply: vi.fn() })
		expect(await screen.findByText('Applied automatically at checkout')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Apply AUTO10' })).toBeNull()
		expect(screen.getByRole('button', { name: 'Apply HELLO5' })).toBeEnabled()
		unmount()

		render(CartOffers, { subtotal: 1000, applied: 'HELLO5', apply: vi.fn() })
		expect(await screen.findByRole('button', { name: 'Apply AUTO10' })).toBeEnabled()
		expect(screen.queryByText('Applied automatically at checkout')).toBeNull()
	})

	it('leave the place empty when the bag does not reach one, and the note says why', async () => {
		offers.rows = [offer({ code: 'AUTO10', applies: false, amount: null, remaining: 200, autoApply: true })]
		render(CartOffers, { subtotal: 300, applied: '', apply: vi.fn() })
		expect(await screen.findByText('Add ₹200 more to use this')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Apply AUTO10' })).toBeNull()
		expect(screen.queryByText('Applied automatically at checkout')).toBeNull()
	})
	it('mark only the one checkout will take, which a quote names when there is one', async () => {
		offers.rows = [
			offer({ code: 'AUTO50', title: 'Rs 50 off', isPercent: false, value: 50, amount: 50, autoApply: true }),
			offer({ code: 'AUTO10', title: '10% off', value: 10, amount: 100, autoApply: true })
		]
		const { unmount } = render(CartOffers, { subtotal: 1000, applied: '', apply: vi.fn() })
		expect(await screen.findAllByText('Applied automatically at checkout')).toHaveLength(1)
		expect(screen.getByText('AUTO10').closest('li')).toHaveTextContent('Applied automatically at checkout')
		unmount()

		render(CartOffers, { subtotal: 1000, applied: '', quoted: 'AUTO50', apply: vi.fn() })
		expect(await screen.findAllByText('Applied automatically at checkout')).toHaveLength(1)
		expect(screen.getByText('AUTO50').closest('li')).toHaveTextContent('Applied automatically at checkout')
	})
})

describe('autoMarked', () => {
	const auto10 = offer({ code: 'AUTO10', amount: 100, autoApply: true })
	const auto50 = offer({ code: 'AUTO50', amount: 50, autoApply: true })
	const freeShip = offer({ code: 'FREESHIP', amount: null, freeShipping: true, autoApply: true })
	const bigSpend = offer({ code: 'BIG20', amount: null, applies: false, remaining: 4000, autoApply: true })

	it('is the automatic code that saves the most, and none while a code is typed', () => {
		expect(autoMarked([auto50, auto10, bigSpend])).toBe('AUTO10')
		expect(autoMarked([auto50, auto10], 'TYPED15')).toBeNull()
	})

	it('is what a quote applied, and none when the quote applied none', () => {
		expect(autoMarked([auto50, auto10], '', 'AUTO50')).toBe('AUTO50')
		expect(autoMarked([auto50, auto10], '', null)).toBeNull()
	})

	it('stays open when free delivery competes or two codes save the same, until a quote says', () => {
		expect(autoMarked([auto10, freeShip])).toBeNull()
		expect(autoMarked([freeShip])).toBe('FREESHIP')
		expect(autoMarked([auto10, offer({ code: 'TEN', amount: 100, autoApply: true })])).toBeNull()
		expect(autoMarked([auto10, freeShip], '', 'FREESHIP')).toBe('FREESHIP')
	})
})
