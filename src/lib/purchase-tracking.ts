// Fires the order-placed analytics from the checkout success page: the GA4 / Google Ads
// `purchase` event (through the core fireGTagEvent, so GTM tags and configured conversions
// pick it up) and Klaviyo's "Placed Order".
//
// The v2 success page shipped without these calls, so no purchase ever reached Google Ads or
// Klaviyo. Browser tracking still misses shoppers who close the tab before the redirect; a
// server-side upload on payment confirmation is the fix for that, and it should reuse the
// transaction id chosen here so Google deduplicates the two.

import { fireGTagEvent } from '$lib/core/utils/index.js'
import { klaviyoIdentify, klaviyoTrackPlacedOrder } from '$lib/klaviyo'

type AnyRec = Record<string, any>

const sum = (orders: AnyRec[], pick: (o: AnyRec) => unknown) =>
	orders.reduce((total, o) => total + (Number(pick(o)) || 0), 0)

/**
 * One purchase per checkout. A multi-vendor checkout creates one order per vendor under a shared
 * parent order number, so those are combined; a single order keeps its own order number.
 */
export function toPurchase(orders: AnyRec[]): AnyRec | null {
	if (!orders?.length) return null
	const first = orders[0]
	const lineItems = orders.flatMap((o) => o.lineItems ?? [])
	// The same fields the success page shows the shopper
	const total = sum(orders, (o) => o.total ?? o.amount?.total)
	const shipping = sum(orders, (o) => o.shippingCharges ?? o.amount?.shipping)

	return {
		...first,
		orderNo: orders.length > 1 ? (first.parentOrderNo ?? first.orderNo) : first.orderNo,
		total,
		tax: sum(orders, (o) => o.tax),
		amount: { ...first.amount, total, shipping },
		lineItems,
		// fireGTagEvent reads `items` with `_id` and `name`; order line items carry `lineItems`
		// with `productId` and `title`.
		items: lineItems.map((li: AnyRec) => ({ ...li, _id: li._id ?? li.productId ?? li.id, name: li.name ?? li.title }))
	}
}

function alreadyTracked(key: string): boolean {
	try {
		if (localStorage.getItem(key)) return true
		localStorage.setItem(key, '1')
	} catch {
		/* storage blocked: fall through and track */
	}
	return false
}

export function trackOrderPlaced(orders: AnyRec[], currency?: string): void {
	const purchase = toPurchase(orders)
	if (!purchase?.orderNo) return

	// Keyed by order and kept in localStorage so a refresh or the success link opened in
	// another tab doesn't count the same order twice.
	if (alreadyTracked(`purchase_tracked_${purchase.orderNo}`)) return

	try {
		// fireGTagEvent holds a single session-wide `purchase` lock that isn't keyed by order, which
		// would drop a second order placed in the same tab. The per-order guard above replaces it.
		sessionStorage.removeItem('event_fired_purchase')
	} catch {
		/* storage blocked */
	}

	fireGTagEvent('purchase', purchase)

	// Klaviyo drops onsite events from browsers it can't tie to a profile, and a guest checkout
	// is never identified anywhere else, so name the buyer before Placed Order. Email only:
	// Klaviyo rejects phone numbers that aren't E.164, which stored ones often aren't.
	const address = purchase.shippingAddress || purchase.billingAddress || {}
	const email = purchase.userEmail || address.email
	if (email) klaviyoIdentify({ email, firstName: address.firstName, lastName: address.lastName })
	klaviyoTrackPlacedOrder(purchase, currency)
}
