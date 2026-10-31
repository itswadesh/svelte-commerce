import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import PriceSummary from '$lib/components/checkout/price-summary.svelte'
import { checkoutFigures, type CheckoutQuote } from '$lib/utils/price'

vi.mock('$lib/core/utils', () => ({
	formatPrice: (n: number) => `₹${n.toFixed(2)}`,
	cn: (...classes: unknown[]) => classes.filter(Boolean).join(' ')
}))
// jsdom has no Web Animations.
vi.mock('$lib/motion', () => ({ fade: () => ({ duration: 0 }), slide: () => ({ duration: 0 }) }))

const cart = { subtotal: 1000, discountAmount: 0, shippingCharges: 49, tax: 0, taxIncluded: false, total: 1049 }
const cod = { name: 'Cash on delivery', fee: 40 }
const auto10: CheckoutQuote = {
	subtotal: 1000,
	shippingCharges: 49,
	discount: 100,
	coupon: { code: 'AUTO10', autoApplied: true, freeShipping: false },
	tax: 162,
	taxIncluded: false,
	codCharges: 40,
	total: 1151
}
const onPayment = { currencyCode: 'INR', shippingResolved: true }

// The payment step's summary as the component rendered it before quotes, on origin/gocomm.
const BEFORE = `<div class="space-y-4" aria-busy="false"><dl class="space-y-3 border-b border-border pb-6"> <div class="flex items-center justify-between gap-4 text-sm"><dt class="font-medium text-muted-foreground">Subtotal</dt> <dd class="font-bold text-foreground">₹1,000</dd></div>  <div class="flex items-center justify-between gap-4 text-sm"><dt class="font-medium text-muted-foreground">Shipping</dt> <dd class="font-bold text-foreground">₹49</dd></div> <div class="flex items-center justify-between gap-4 text-sm"><dt class="font-medium text-muted-foreground">Cash on delivery charge</dt> <dd class="font-bold text-foreground">₹40</dd></div> </dl> <dl class="pt-2"><div class="flex items-start justify-between gap-4"><dt class="flex flex-col gap-1"><span class="text-sm font-bold text-foreground">Total before tax</span>  <span class="text-xs font-normal text-muted-foreground">Any tax is added when you place your order.</span></dt> <dd class="shrink-0 text-xl font-bold text-foreground">₹1,089</dd></div></dl></div>`

describe('the price summary on payment', () => {
	it('renders the markup it always did for a backend that cannot quote', () => {
		const { container } = render(PriceSummary, { ...checkoutFigures(cart, cod, false, null), ...onPayment, coupon: null, pending: false, error: '' })
		expect(container.innerHTML.replace(/<!--[^]*?-->/g, '')).toBe(BEFORE)
	})

	it('names the code checkout applies, says it chose it, and shows its total', () => {
		render(PriceSummary, { ...checkoutFigures(cart, cod, false, auto10), ...onPayment })
		expect(screen.getByText('Discount (AUTO10)')).toBeInTheDocument()
		expect(screen.getByText('Applied automatically')).toBeInTheDocument()
		expect(screen.getByText('-₹100')).toBeInTheDocument()
		expect(screen.getByText('Tax').nextElementSibling).toHaveTextContent('₹162')
		expect(screen.getByText('Total').closest('div')).toHaveTextContent('₹1,151')
		expect(screen.queryByText('Any tax is added when you place your order.')).toBeNull()
	})

	it('says a free-delivery code frees delivery', () => {
		const freeShip = { ...auto10, discount: 0, coupon: { code: 'SHIPFREE', autoApplied: false, freeShipping: true }, shippingCharges: 0, total: 1202 }
		render(PriceSummary, { ...checkoutFigures(cart, cod, false, freeShip), ...onPayment })
		expect(screen.getByText('Discount (SHIPFREE)').nextElementSibling).toHaveTextContent('Free delivery')
		expect(screen.queryByText('Applied automatically')).toBeNull()
	})

	it("shows checkout's reason instead of any figure, with a way to ask again", async () => {
		const onretry = vi.fn()
		const { container } = render(PriceSummary, {
			...checkoutFigures(cart, cod, false, auto10),
			...onPayment,
			error: '2 line(s) are no longer valid',
			onretry
		})
		expect(screen.getByRole('alert')).toHaveTextContent('2 line(s) are no longer valid')
		expect(container.textContent).not.toContain('₹')
		await fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
		expect(onretry).toHaveBeenCalledTimes(1)
	})

	it('dims the figures while a new total is worked out', () => {
		const { container } = render(PriceSummary, { ...checkoutFigures(cart, cod, false, auto10), ...onPayment, pending: true })
		expect(screen.getByText('₹1,151')).toHaveClass('opacity-60')
		expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
	})
})
