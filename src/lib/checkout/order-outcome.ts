// What the success page may say about an order, from what the backend reports. Reaching that page
// proves nothing: a gateway's window closes the same way on a failed attempt, and the webhook that
// marks an order paid can land after the shopper does.

/**
 * - `paid`, `pay-on-delivery`: a sale, and the page thanks the shopper.
 * - `whatsapp`: a sale settled in the shop's chat (GoCommerce D255); the shopper sends it there.
 * - `received`: the backend reports no payment state this page knows, so it claims none.
 * - `confirming`: paid online, or not, and the backend does not know yet.
 * - `failed`: not paid, and the shopper is told so.
 * - `unknown`: no order to read.
 */
export type OrderOutcome = 'paid' | 'pay-on-delivery' | 'whatsapp' | 'received' | 'confirming' | 'failed' | 'unknown'

type OrderState = { paymentStatus?: unknown; paymentMethod?: unknown; status?: unknown } | null | undefined

const PAID = new Set(['paid', 'success', 'succeeded', 'captured', 'completed'])
const FAILED = new Set(['failed', 'failure', 'declined', 'cancelled', 'canceled', 'expired', 'voided'])
const UNSETTLED = new Set(['pending', 'unpaid', 'processing', 'initiated', 'authorized'])
const PAY_ON_DELIVERY = new Set(['cod', 'cash on delivery', 'cash_on_delivery'])

const word = (v: unknown) =>
	String(v ?? '')
		.trim()
		.toLowerCase()

export function orderOutcome(order: OrderState): OrderOutcome {
	if (!order) return 'unknown'
	const payment = word(order.paymentStatus)
	if (PAID.has(payment)) return 'paid'
	if (FAILED.has(payment)) return 'failed'
	if (UNSETTLED.has(payment) && FAILED.has(word(order.status))) return 'failed'
	if (PAY_ON_DELIVERY.has(word(order.paymentMethod))) return 'pay-on-delivery'
	if (word(order.paymentMethod) === 'whatsapp') return 'whatsapp'
	return UNSETTLED.has(payment) ? 'confirming' : 'received'
}

/** The outcomes that are a sale: only these count as a purchase or ask for a review. */
export const isSale = (outcome: OrderOutcome) =>
	outcome === 'paid' || outcome === 'pay-on-delivery' || outcome === 'whatsapp' || outcome === 'received'

export const OUTCOME_COPY: Record<OrderOutcome, { title: string; heading: string; body: string }> = {
	paid: {
		title: 'Order confirmed',
		heading: 'Thank you for your order',
		body: "Your payment went through and we've received your order. We'll notify you as soon as it's on its way."
	},
	'pay-on-delivery': {
		title: 'Order confirmed',
		heading: 'Thank you for your order',
		body: "We've received your order. You pay when it's delivered, and we'll notify you as soon as it's on its way."
	},
	whatsapp: {
		title: 'Order placed',
		heading: 'Send your order on WhatsApp',
		body: "Your order is placed. Send it to the shop on WhatsApp, and they'll confirm it there and tell you how to pay."
	},
	received: {
		title: 'Order received',
		heading: "We've received your order",
		body: "We'll notify you as soon as it's on its way."
	},
	confirming: {
		title: 'Confirming payment',
		heading: "We're confirming your payment",
		body: "We haven't had confirmation of this payment yet, and this page updates when we do. Please don't pay again."
	},
	failed: {
		title: 'Payment not completed',
		heading: "Your payment didn't go through",
		body: "We haven't received payment for this order. If money left your account, contact us and quote the order number."
	},
	unknown: {
		title: 'Checking your order',
		heading: "We're checking your order",
		body: "Please don't pay again until you've seen this order's status."
	}
}

/** A WhatsApp order opened in a browser that did not place it has no link to send; the shop has the order. */
export const WHATSAPP_ELSEWHERE_COPY = {
	title: 'Order placed',
	heading: 'Thank you for your order',
	body: 'Your order is placed. The shop confirms it with you on WhatsApp and tells you there how to pay.'
}
