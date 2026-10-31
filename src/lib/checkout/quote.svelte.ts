import { checkoutService } from '$lib/core/services'
import type { CheckoutQuote } from '$lib/utils/price'

type Quoting = {
	getQuote?: (args: { cartId?: string; method?: string }) => Promise<CheckoutQuote | null>
	expectTotal?: (args: { cartId?: string; total: number | null; onChange: (quote: CheckoutQuote, message: string) => void }) => void
}

type Checkout = {
	loadingForPaymentMethods: boolean
	SELECTED_PG_CODE: string
	cartState: { cart?: Bag | null }
}

type Bag = {
	id?: string
	email?: string | null
	couponCode?: string | null
	shippingRateId?: string | null
	shippingAddress?: { country?: string; countryCode?: string; state?: string } | null
	lineItems?: { id?: string; qty?: number; price?: number }[]
}

/** Long enough for a slow phone connection; a quote that never answers must not hold checkout. */
export const QUOTE_TIMEOUT_MS = 15000

const quotable = (cart?: Bag | null): cart is Bag & { id: string } => !!cart?.id && !!cart.shippingAddress && !!cart.lineItems?.length

/**
 * Other code writes onto the cart, such as core's analytics adding a field to a line as the order
 * is placed, and a key over the whole cart would ask again mid-checkout.
 */
export function quoteKey(method: string, cart: Bag): string {
	const to = cart.shippingAddress
	return JSON.stringify([
		method,
		cart.id,
		cart.email,
		cart.couponCode,
		cart.shippingRateId,
		to?.countryCode || to?.country,
		to?.state,
		cart.lineItems?.map((l) => [l.id, l.qty, l.price])
	])
}

export class LiveQuote {
	/** The last answer: undefined before the first, null when the backend has nothing to quote. */
	current = $state.raw<CheckoutQuote | null | undefined>(undefined)
	/** The payment method `current` was asked for. */
	method = $state('')
	/** Checkout's own sentence for why it would refuse now; it stays until an answer lands. */
	error = $state('')
	pending = $state(false)
	/** Checkout's sentence for a Confirm it refused because the total moved; `current` is already the new one. */
	moved = $state('')
	readonly supported: boolean
	#key: string | undefined
	#run: (() => Promise<CheckoutQuote | null>) | undefined
	#method = ''
	#asks = 0
	#expect: Quoting['expectTotal']

	constructor(checkout: Checkout) {
		const svc = checkoutService as unknown as Quoting
		this.#expect = typeof svc.expectTotal === 'function' ? svc.expectTotal.bind(svc) : undefined
		const getQuote = typeof svc.getQuote === 'function' ? svc.getQuote.bind(svc) : null
		this.supported = getQuote !== null
		if (!getQuote) return
		$effect(() => {
			const cart = checkout.cartState.cart
			if (checkout.loadingForPaymentMethods || !quotable(cart)) return
			const method = checkout.SELECTED_PG_CODE
			this.ask(quoteKey(method, cart), () => getQuote({ cartId: cart.id, method }), method)
		})
	}

	ask(key: string, run: () => Promise<CheckoutQuote | null>, method = '') {
		if (key === this.#key) return
		this.#key = key
		this.#run = run
		this.#method = method
		this.#send(run, method)
	}

	retry = () => {
		if (this.#run) this.#send(this.#run, this.#method)
	}

	awaitingFirst(cart?: Bag | null): boolean {
		return this.supported && quotable(cart) && this.current === undefined && !this.error
	}

	/** Whether the total on screen is the one checkout would charge for the bag as it is now. */
	confirmable(cart?: Bag | null): boolean {
		return !this.pending && !this.error && !this.awaitingFirst(cart)
	}

	/**
	 * Hands the backend the total on screen as the shopper confirms, so checkout refuses a different
	 * one instead of charging it. The refusal puts checkout's figures on screen at once, and nothing
	 * is placed until the shopper confirms again.
	 */
	confirming(cartId?: string) {
		this.moved = ''
		this.#expect?.({
			cartId,
			total: this.current?.total ?? null,
			onChange: (quote, message) => {
				this.current = quote
				this.error = ''
				this.moved = message
			}
		})
	}

	#send(run: () => Promise<CheckoutQuote | null>, method: string) {
		const ask = ++this.#asks
		this.pending = true
		let timer: ReturnType<typeof setTimeout> | undefined
		const late = new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error('')), QUOTE_TIMEOUT_MS)
		})
		Promise.race([run(), late])
			.then(
				(answer) => {
					if (ask !== this.#asks) return
					this.current = answer
					this.method = method
					this.error = ''
					this.moved = ''
					this.pending = false
				},
				(err: unknown) => {
					if (ask !== this.#asks) return
					this.error = (err as Error | undefined)?.message || 'We could not work out your total. Please try again.'
					this.pending = false
				}
			)
			.finally(() => clearTimeout(timer))
	}
}
