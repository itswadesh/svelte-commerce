/**
 * The arithmetic and wording behind the order bump, the free-delivery bar and
 * the bag's offers (GoCommerce D133). Pure, so it is tested without a page.
 *
 * Every figure comes from the backend: the add-on's price is the offer the
 * engine will charge, the threshold is the store's own free-delivery rate, and
 * an offer's "add more" is the engine's sum. Nothing here invents a number.
 */

export type AddOnOption = {
	id: string
	productId: string
	variantId: string
	title: string
	variantTitle?: string
	thumbnail?: string | null
	/** What ticking it adds: the offer price, or its own when there is none. */
	price: number
	/** Its own price, struck through beside an offer. */
	regularPrice: number
	hasOffer: boolean
	inStock: boolean
}

export type FreeDelivery = {
	qualifies: boolean
	threshold: number | null
	remaining: number | null
	subtotal: number
} | null

export type BagOffer = {
	code: string
	title: string
	isPercent: boolean
	freeShipping?: boolean
	value: number
	minAmount: number | null
	applies: boolean
	amount: number | null
	remaining: number | null
	reason?: string
	/** Checkout applies it by itself when no code is typed (GoCommerce D179). */
	autoApply?: boolean
}

/** The add button's figure: the product's price and every ticked add-on's. Rounded to paise. */
export function bumpTotal(price: number, picked: readonly Pick<AddOnOption, 'price'>[]): number {
	const sum = picked.reduce((n, a) => n + (Number(a.price) || 0), Number(price) || 0)
	return Math.round(sum * 100) / 100
}

/**
 * The bar's state. `progress` is 0–1 of the way to the threshold, for a bar
 * drawn with transform; null when there is nothing to show — no threshold to
 * reach and not already free.
 */
export function freeDeliveryState(f: FreeDelivery): { qualifies: boolean; remaining: number; progress: number } | null {
	if (!f) return null
	if (f.qualifies) return { qualifies: true, remaining: 0, progress: 1 }
	if (f.threshold === null || f.remaining === null || f.threshold <= 0) return null
	const progress = Math.min(1, Math.max(0, (f.threshold - f.remaining) / f.threshold))
	return { qualifies: false, remaining: f.remaining, progress }
}

/** What an offer's value is, in words: "5% off", "₹100 off", "Free delivery". */
export function offerValue(o: BagOffer, money: (n: number) => string): string {
	if (o.freeShipping) return 'Free delivery'
	return o.isPercent ? `${o.value}% off` : `${money(o.value)} off`
}

/** The line under an offer: what it saves now, or what the bag still needs. */
export function offerNote(o: BagOffer, money: (n: number) => string): string {
	if (o.applies) return o.amount ? `You save ${money(o.amount)}` : o.freeShipping ? 'Delivery is free with this' : ''
	if (o.remaining !== null && o.remaining > 0) return `Add ${money(o.remaining)} more to use this`
	return o.reason ?? ''
}

/**
 * The one automatic code checkout will take off by itself, or null when that cannot be said
 * (GoCommerce D179). Checkout takes the single automatic code that saves the most, and none while
 * a code is typed. `quoted` is the automatic code a checkout quote applied (null for none); with no
 * quote, a free-delivery code's saving waits on the delivery chosen, so it leaves the answer open.
 */
export function autoMarked(offers: readonly BagOffer[], typed?: string | null, quoted?: string | null): string | null {
	if (typed) return null
	if (quoted !== undefined) return quoted
	const live = offers.filter((o) => o.autoApply && o.applies)
	if (live.length === 1) return live[0].code
	if (live.some((o) => o.freeShipping)) return null
	const top = Math.max(...live.map((o) => o.amount ?? 0))
	const best = live.filter((o) => (o.amount ?? 0) === top)
	return best.length === 1 ? best[0].code : null
}

/** Offers that apply first, then the nearest to applying; ties keep the backend's order. */
export function sortOffers(offers: readonly BagOffer[]): BagOffer[] {
	return offers
		.map((o, i) => ({ o, i }))
		.sort((a, b) => {
			if (a.o.applies !== b.o.applies) return a.o.applies ? -1 : 1
			const ra = a.o.remaining ?? Infinity
			const rb = b.o.remaining ?? Infinity
			return ra === rb ? a.i - b.i : ra - rb
		})
		.map(({ o }) => o)
}
