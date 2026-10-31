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
