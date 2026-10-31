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
	total: number
}

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
		total: quote.total,
		taxPending: false
	}
}
