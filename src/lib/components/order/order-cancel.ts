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
	/** Paid online, so approving refunds it. Cash on delivery, in full or part, is refunded by hand if at all. */
	prepaid: boolean
}

const CASH = ['cod', 'cod_partial']

/** The engine's order (snake_case, as `/api/orders/{number}` answers it). */
export function cancelView(raw: any): CancelView {
	return {
		cancellable: raw?.cancellable === true,
		cancellation: raw?.cancellation?.status ? raw.cancellation : null,
		prepaid: !CASH.includes(String(raw?.payment_provider ?? '').toLowerCase()) && ['paid', 'refunded'].includes(String(raw?.payment_status ?? ''))
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
