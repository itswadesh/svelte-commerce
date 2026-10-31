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
