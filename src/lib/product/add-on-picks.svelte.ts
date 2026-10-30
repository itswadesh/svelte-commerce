import { toast } from 'svelte-sonner'
import { cartService } from '$lib/core/services'
import type { AddOnOption } from './upsells'

/**
 * The add-ons ticked in a product's "Complete the set", shared between the box
 * that ticks them and the add button that buys them, which sit in different
 * components (and the add button twice: in the buy box and in the phone's
 * sticky bar). Keyed by product, so another product's page starts empty.
 */
export const addOnPicks = $state<{ productId: string; items: AddOnOption[] }>({ productId: '', items: [] })

/** Starts the picks for a product's page, dropping any from another one. */
export function resetPicks(productId: string) {
	addOnPicks.productId = productId
	addOnPicks.items = []
}

export function isPicked(id: string) {
	return addOnPicks.items.some((a) => a.id === id)
}

export function togglePick(productId: string, option: AddOnOption) {
	if (addOnPicks.productId !== productId) resetPicks(productId)
	addOnPicks.items = isPicked(option.id) ? addOnPicks.items.filter((a) => a.id !== option.id) : [...addOnPicks.items, option]
}

/** The picks for this product, emptied: they go into the bag once. */
export function takePicks(productId: string): AddOnOption[] {
	if (addOnPicks.productId !== productId) return []
	const items = addOnPicks.items
	addOnPicks.items = []
	return items
}

export async function addPicks(productId: string, cartState: { cart: unknown } | undefined) {
	const items = takePicks(productId)
	const svc = cartService as unknown as { addAddOn?: (q: { addOnId: string }) => Promise<any> }
	if (!items.length || typeof svc.addAddOn !== 'function') return
	for (const item of items) {
		try {
			const cart = await svc.addAddOn({ addOnId: item.id })
			if (cart && cartState) cartState.cart = cart
		} catch (err) {
			toast.error(`Could not add ${item.title}`, { description: (err as Error)?.message })
		}
	}
}
