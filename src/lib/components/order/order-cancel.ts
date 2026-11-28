// The engine's order as order-cancel.svelte reads it (GoCommerce D366), kept out of the component
// so the rules can be tested without a browser.

export type Cancellation = {
	status: 'pending' | 'approved' | 'rejected'
	requested_at?: string
	decided_at?: string | null
	reason?: string
	note?: string
}

export type CancelView = {
	cancellable: boolean
	cancellation: Cancellation | null
	/** Paid through a gateway, so approving refunds it automatically. */
	prepaid: boolean
	/** Paid straight to the store's UPI ID, which no gateway can send back: the store refunds it by hand. */
	paidDirect: boolean
}

const CASH = ['cod', 'cod_partial']
// The engine's own method with no gateway behind it (a UPI transfer the shopper reports by reference).
const DIRECT = ['upi']

/** The engine's order (snake_case, as `/api/orders/{number}` answers it). */
export function cancelView(raw: any): CancelView {
	const provider = String(raw?.payment_provider ?? '').toLowerCase()
	const paid = ['paid', 'refunded'].includes(String(raw?.payment_status ?? ''))
	return {
		cancellable: raw?.cancellable === true,
		cancellation: raw?.cancellation?.status ? raw.cancellation : null,
		prepaid: paid && !CASH.includes(provider) && !DIRECT.includes(provider),
		paidDirect: paid && DIRECT.includes(provider)
	}
}

/** The access token the connector keeps for an order this browser placed or opened (`gocommerce_orders`). */
export function keptOrderToken(number: string): string | undefined {
	try {
		const kept = JSON.parse(localStorage.getItem('gocommerce_orders') || '[]') as { number?: string; token?: string }[]
		return kept.find((o) => o?.number === number)?.token || undefined
	} catch {
		return undefined
	}
}

/** The engine's messages start in lower case ("order GC-1 has already shipped…"); a sentence on screen does not. */
export const sentence = (s?: string | null) => {
	const t = (s ?? '').trim()
	return t ? t[0].toUpperCase() + t.slice(1) : ''
}
