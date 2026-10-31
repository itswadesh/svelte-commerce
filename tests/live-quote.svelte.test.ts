import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushSync } from 'svelte'
import type { CheckoutQuote } from '$lib/utils/price'

type Refused = (quote: CheckoutQuote, message: string) => void

const services = vi.hoisted(() => ({
	checkoutService: {} as {
		getQuote?: (args: { cartId?: string; method?: string }) => Promise<CheckoutQuote | null>
		expectTotal?: (args: { cartId?: string; total: number | null; onChange: Refused }) => void
	}
}))
vi.mock('$lib/core/services', () => services)

const { LiveQuote, QUOTE_TIMEOUT_MS, quoteKey } = await import('$lib/checkout/quote.svelte')

type Checkout = ConstructorParameters<typeof LiveQuote>[0]

const quoted = (total: number): CheckoutQuote => ({
	subtotal: 1000,
	shippingCharges: 49,
	discount: 100,
	coupon: { code: 'AUTO10', autoApplied: true, freeShipping: false },
	tax: 162,
	taxIncluded: false,
	codCharges: 40,
	total
})

function later() {
	let resolve!: (answer: CheckoutQuote | null) => void
	let reject!: (err: unknown) => void
	const promise = new Promise<CheckoutQuote | null>((res, rej) => {
		resolve = res
		reject = rej
	})
	return { promise, resolve, reject }
}

const settle = () => new Promise((resolve) => setTimeout(resolve))

const stops: (() => void)[] = []
function live(checkout: Checkout = { loadingForPaymentMethods: true, SELECTED_PG_CODE: '', cartState: { cart: null } }) {
	let quote!: InstanceType<typeof LiveQuote>
	stops.push(
		$effect.root(() => {
			quote = new LiveQuote(checkout)
		})
	)
	return quote
}

beforeEach(() => {
	services.checkoutService.getQuote = vi.fn(async () => quoted(1151))
})

afterEach(() => {
	stops.splice(0).forEach((stop) => stop())
})

describe('LiveQuote.ask', () => {
	it('keeps the newest answer when an older one lands after it', async () => {
		const quote = live()
		const first = later()
		const second = later()
		quote.ask('COD|a', () => first.promise)
		quote.ask('COD|b', () => second.promise)
		second.resolve(quoted(1111))
		await settle()
		first.resolve(quoted(1151))
		await settle()
		expect(quote.current?.total).toBe(1111)
		expect(quote.pending).toBe(false)
	})

	it('does not ask twice for the key it last asked', () => {
		const quote = live()
		const run = vi.fn(async () => quoted(1151))
		quote.ask('COD|a', run)
		quote.ask('COD|a', run)
		expect(run).toHaveBeenCalledTimes(1)
		quote.ask('RAZORPAY|a', run)
		expect(run).toHaveBeenCalledTimes(2)
	})

	it("holds checkout's reason until an answer lands, then clears it", async () => {
		const quote = live()
		quote.ask('COD|a', () => Promise.reject(new Error('2 line(s) are no longer valid')))
		await settle()
		expect(quote.error).toBe('2 line(s) are no longer valid')
		expect(quote.pending).toBe(false)

		const next = later()
		quote.ask('COD|b', () => next.promise)
		expect(quote.pending).toBe(true)
		expect(quote.error).toBe('2 line(s) are no longer valid')
		next.resolve(quoted(1089))
		await settle()
		expect(quote.error).toBe('')
		expect(quote.current?.total).toBe(1089)
	})

	it('drops an older failure that lands after a newer answer', async () => {
		const quote = live()
		const first = later()
		quote.ask('COD|a', () => first.promise)
		quote.ask('COD|b', async () => quoted(1151))
		await settle()
		first.reject(new Error('this store does not deliver to XX'))
		await settle()
		expect(quote.error).toBe('')
		expect(quote.current?.total).toBe(1151)
	})

	it('says so in its own words when the failure has none', async () => {
		const quote = live()
		quote.ask('COD|a', () => Promise.reject({}))
		await settle()
		expect(quote.error).toBe('We could not work out your total. Please try again.')
	})

	it('asks again with the same call on retry', async () => {
		const quote = live()
		const run = vi.fn().mockRejectedValueOnce(new Error('this store does not deliver to XX')).mockResolvedValueOnce(quoted(1151))
		quote.ask('COD|a', run)
		await settle()
		expect(quote.error).toBe('this store does not deliver to XX')
		quote.retry()
		await settle()
		expect(run).toHaveBeenCalledTimes(2)
		expect(quote.error).toBe('')
		expect(quote.current?.total).toBe(1151)
	})

	it('gives up on an answer that never comes, so checkout is not held', async () => {
		vi.useFakeTimers()
		try {
			const quote = live()
			quote.ask('COD|a', () => new Promise(() => {}))
			expect(quote.pending).toBe(true)
			await vi.advanceTimersByTimeAsync(QUOTE_TIMEOUT_MS)
			expect(quote.pending).toBe(false)
			expect(quote.error).toBe('We could not work out your total. Please try again.')
		} finally {
			vi.useRealTimers()
		}
	})

	it('remembers which method its answer is for, while a newer ask is out', async () => {
		const quote = live()
		quote.ask('COD|a', async () => quoted(1151), 'COD')
		await settle()
		quote.ask('RAZORPAY|a', () => new Promise(() => {}), 'RAZORPAY')
		expect(quote.method).toBe('COD')
		expect(quote.current?.codCharges).toBe(40)
	})

	it('lets an order be confirmed only on a settled answer for the bag on screen', async () => {
		const quote = live()
		const cart = { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, lineItems: [{ id: 'l1' }] }
		expect(quote.confirmable(cart)).toBe(false)
		const next = later()
		quote.ask('COD|a', () => next.promise)
		expect(quote.confirmable(cart)).toBe(false)
		next.resolve(quoted(1151))
		await settle()
		expect(quote.confirmable(cart)).toBe(true)
		quote.ask('COD|b', () => Promise.reject(new Error('2 line(s) are no longer valid')))
		await settle()
		expect(quote.confirmable(cart)).toBe(false)
	})
})

describe('LiveQuote.confirming', () => {
	const cart = { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, lineItems: [{ id: 'l1' }] }
	const sentence = 'Your total changed to ₹1,201. Check the new total and confirm again.'

	it('hands the backend the total on screen, and none when nothing was quoted', async () => {
		const expectTotal = vi.fn()
		services.checkoutService.expectTotal = expectTotal
		const quote = live()
		quote.ask('COD|a', async () => quoted(1151))
		await settle()
		quote.confirming('cart-1')
		quote.ask('COD|b', async () => null)
		await settle()
		quote.confirming('cart-1')
		expect(expectTotal.mock.calls.map(([args]) => [args.cartId, args.total])).toEqual([
			['cart-1', 1151],
			['cart-1', null]
		])
	})

	it("shows checkout's figures and sentence at once when it refuses a total that moved, and waits for a fresh Confirm", async () => {
		let refuse!: Refused
		services.checkoutService.expectTotal = ({ onChange }) => {
			refuse = onChange
		}
		const quote = live()
		quote.ask('COD|a', async () => quoted(1151), 'COD')
		await settle()
		quote.confirming('cart-1')
		refuse(quoted(1201), sentence)
		expect([quote.current?.total, quote.method, quote.moved, quote.confirmable(cart)]).toEqual([1201, 'COD', sentence, true])

		quote.confirming('cart-1')
		expect(quote.moved).toBe('')
	})

	it('lets an answer asked after the refusal replace its figures and its sentence', async () => {
		let refuse!: Refused
		services.checkoutService.expectTotal = ({ onChange }) => {
			refuse = onChange
		}
		const quote = live()
		quote.ask('COD|a', async () => quoted(1151))
		await settle()
		quote.confirming('cart-1')
		const asked = later()
		quote.ask('COD|b', () => asked.promise)
		refuse(quoted(1201), sentence)
		expect([quote.current?.total, quote.moved, quote.confirmable(cart)]).toEqual([1201, sentence, false])
		asked.resolve(quoted(1190))
		await settle()
		expect([quote.current?.total, quote.moved, quote.confirmable(cart)]).toEqual([1190, '', true])
	})
})

describe('quoteKey', () => {
	const bag = () => ({
		id: 'cart-1',
		email: 'shopper@example.test',
		couponCode: null as string | null,
		shippingRateId: '10',
		shippingAddress: { countryCode: 'IN', state: 'Karnataka' },
		lineItems: [{ id: 'l1', qty: 1, price: 1000 }] as { id: string; qty: number; price: number; discount?: object }[]
	})

	it('stays put when other code writes onto a line, as core does while placing the order', () => {
		const cart = bag()
		const before = quoteKey('COD', cart)
		cart.lineItems[0].discount = {}
		expect(quoteKey('COD', cart)).toBe(before)
	})

	it('moves with everything checkout prices on', () => {
		const base = quoteKey('COD', bag())
		const moved = [
			quoteKey('RAZORPAY', bag()),
			quoteKey('COD', { ...bag(), couponCode: 'TYPED15' }),
			quoteKey('COD', { ...bag(), shippingRateId: '11' }),
			quoteKey('COD', { ...bag(), email: 'other@example.test' }),
			quoteKey('COD', { ...bag(), shippingAddress: { countryCode: 'IN', state: 'Kerala' } }),
			quoteKey('COD', { ...bag(), lineItems: [{ id: 'l1', qty: 2, price: 1000 }] }),
			quoteKey('COD', { ...bag(), lineItems: [{ id: 'l1', qty: 1, price: 1100 }] })
		]
		expect(moved.filter((key) => key === base)).toEqual([])
		expect(new Set(moved).size).toBe(7)
	})
})

describe('LiveQuote on the payment route', () => {
	it('asks for the cart and method on screen, and again when either changes', async () => {
		const getQuote = vi.fn(async () => quoted(1151))
		services.checkoutService.getQuote = getQuote
		const checkout = $state({
			loadingForPaymentMethods: true,
			SELECTED_PG_CODE: 'COD',
			cartState: {
				cart: { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, shippingRateId: 'standard', lineItems: [{ id: 'l1' }] }
			}
		})
		const quote = live(checkout)
		flushSync()
		expect(quote.supported).toBe(true)
		expect(quote.awaitingFirst(checkout.cartState.cart)).toBe(true)
		expect(getQuote).toHaveBeenCalledTimes(0)

		checkout.loadingForPaymentMethods = false
		flushSync()
		expect(getQuote).toHaveBeenLastCalledWith({ cartId: 'cart-1', method: 'COD' })
		await settle()
		expect(quote.awaitingFirst(checkout.cartState.cart)).toBe(false)
		expect(quote.current?.total).toBe(1151)

		checkout.SELECTED_PG_CODE = 'RAZORPAY'
		flushSync()
		expect(getQuote).toHaveBeenLastCalledWith({ cartId: 'cart-1', method: 'RAZORPAY' })

		checkout.cartState.cart.shippingRateId = 'express'
		flushSync()
		expect(getQuote).toHaveBeenCalledTimes(3)
	})

	it('does not ask about a bag just checked out, which has no lines left', () => {
		const getQuote = vi.fn(async () => quoted(1151))
		services.checkoutService.getQuote = getQuote
		const checkout = $state({
			loadingForPaymentMethods: false,
			SELECTED_PG_CODE: 'COD',
			cartState: { cart: { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, lineItems: [{ id: 'l1' }] as { id: string }[] } }
		})
		const quote = live(checkout)
		flushSync()
		expect(getQuote).toHaveBeenCalledTimes(1)

		checkout.cartState.cart = { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, lineItems: [] }
		flushSync()
		expect(getQuote).toHaveBeenCalledTimes(1)
		expect(quote.awaitingFirst(checkout.cartState.cart)).toBe(false)
	})

	it('stays out of the way on a backend that cannot quote', () => {
		delete services.checkoutService.getQuote
		delete services.checkoutService.expectTotal
		const checkout = {
			loadingForPaymentMethods: false,
			SELECTED_PG_CODE: 'COD',
			cartState: { cart: { id: 'cart-1', shippingAddress: { countryCode: 'IN', state: 'Odisha' }, lineItems: [{ id: 'l1' }] } }
		}
		const quote = live(checkout)
		flushSync()
		expect(quote.supported).toBe(false)
		expect(quote.awaitingFirst(checkout.cartState.cart)).toBe(false)
		expect(quote.current).toBeUndefined()
		quote.confirming('cart-1')
		expect(quote.moved).toBe('')
	})
})
