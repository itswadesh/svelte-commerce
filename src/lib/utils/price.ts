import { formatPrice as coreFormatPrice } from '$lib/core/utils'
import { shopperPrice } from './price-text'

/** Every price a shopper reads: core's symbol and layout, with the amount as `shopperPrice` writes it. */
export function formatPrice(price: number, currencyCode: string): string {
	return shopperPrice(coreFormatPrice(price, currencyCode), price, currencyCode)
}

export type PaymentFee = { label: string; amount: number }

export function paymentFee(method?: { name?: string; fee?: number | null } | null): PaymentFee | null {
	const amount = Number(method?.fee)
	return amount > 0 ? { label: `${method?.name} charge`, amount } : null
}

export function totalWithFee(total: number | null | undefined, fee: PaymentFee | null): number {
	return (Number(total) || 0) + (fee?.amount ?? 0)
}

export function taxIsPending(includesTax: boolean | null | undefined, cart?: { tax?: number | null; taxIncluded?: boolean | null } | null): boolean {
	return cart?.taxIncluded === false && includesTax !== true && !(Number(cart.tax) > 0)
}

export function totalLabel(shippingResolved: boolean, taxPending: boolean): string {
	if (!shippingResolved) return 'Estimated total'
	return taxPending ? 'Total before tax' : 'Total'
}

export function addedTax(order?: { tax?: number | null; taxIncluded?: boolean | null } | null): number {
	return order?.taxIncluded === false ? Math.max(0, Number(order.tax) || 0) : 0
}

export type QuotedCoupon = { code: string; autoApplied: boolean; freeShipping: boolean }

/** What checkout would charge, as a connector that can quote gives it: the order's own names. */
export type CheckoutQuote = {
	subtotal: number
	shippingCharges: number
	discount: number
	coupon: QuotedCoupon | null
	tax: number
	taxIncluded: boolean
	codCharges: number
	/** What a gift card on the cart pays (GoCommerce D250); `total` is what is left for the payment method. */
	giftCard?: QuotedGiftCard | null
	total: number
	/** The split, quoted for part-paid cash on delivery alone (GoCommerce D297). */
	partialCod?: PartialCodSplit | null
}

/** What part-paid cash on delivery takes online now and in cash at the door (GoCommerce D297). */
export type PartialCodSplit = { payNow: number; payOnDelivery: number; refundNote: string }

/**
 * The split to show beside part-paid cash on delivery, or null where checkout would refuse it.
 * The quote's own once it was asked for this method; until then the advance against the total on
 * screen with this method's charge in place of the one quoted. Checkout offers it only on a total
 * of at least `minTotal`, twice the advance, so below that it is not offered at all.
 */
export function partialCodSplit(
	method: { advance?: number | null; minTotal?: number | null; fee?: number | null; refundNote?: string | null } | null | undefined,
	quote: CheckoutQuote | null | undefined,
	quotedForMethod: boolean,
	cartTotal: number | null | undefined
): PartialCodSplit | null {
	if (quotedForMethod && quote?.partialCod) return quote.partialCod
	const advance = Number(method?.advance)
	if (!(advance > 0)) return null
	const base = quote ? Number(quote.total) - (Number(quote.codCharges) || 0) : Number(cartTotal) || 0
	const total = base + (Number(method?.fee) > 0 ? Number(method?.fee) : 0)
	if (total < (Number(method?.minTotal) || 2 * advance)) return null
	return { payNow: advance, payOnDelivery: Math.round((total - advance) * 100) / 100, refundNote: method?.refundNote ?? '' }
}

export type QuotedGiftCard = { last4: string; amount: number }

/** True when a gift card leaves nothing for a payment method to collect. */
export const coveredByGiftCard = (quote?: CheckoutQuote | null): boolean => !!quote?.giftCard && Number(quote.total) === 0

export function checkoutFigures(
	cart:
		| {
				subtotal?: number | null
				discountAmount?: number | null
				shippingCharges?: number | null
				tax?: number | null
				taxIncluded?: boolean | null
				total?: number | null
		  }
		| null
		| undefined,
	method: { name?: string; fee?: number | null } | null | undefined,
	includesTax: boolean | null | undefined,
	quote: CheckoutQuote | null | undefined
): {
	subtotal?: number | null
	discount?: number | null
	coupon: QuotedCoupon | null
	shipping?: number | null
	fee: PaymentFee | null
	tax?: number | null
	giftCard: QuotedGiftCard | null
	total: number
	taxPending: boolean
} {
	if (!quote) {
		const fee = paymentFee(method)
		return {
			subtotal: cart?.subtotal,
			discount: cart?.discountAmount,
			coupon: null,
			shipping: cart?.shippingCharges,
			fee,
			tax: cart?.tax,
			giftCard: null,
			total: totalWithFee(cart?.total, fee),
			taxPending: taxIsPending(includesTax, cart)
		}
	}
	return {
		subtotal: quote.subtotal,
		discount: quote.discount,
		coupon: quote.coupon,
		shipping: quote.shippingCharges,
		fee: paymentFee({ name: method?.name, fee: quote.codCharges }),
		tax: addedTax(quote),
		giftCard: quote.giftCard ?? null,
		total: quote.total,
		taxPending: false
	}
}
