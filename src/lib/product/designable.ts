import { SvelteSet } from 'svelte/reactivity'

const DESIGN_FIRST = 'This one is made to your design. Design it first.'

// Search hits, engines older than the flag and a flag gone stale leave designable unsaid; a
// design_required refusal is then the only sign.
const refused = new SvelteSet<string>()

export const madeToDesign = (product: { id?: unknown; designable?: boolean } | null | undefined): boolean =>
	product?.designable === true || (product?.id != null && refused.has(String(product.id)))

type Add = (q: { productId?: unknown }) => Promise<unknown>

// Core's cart store catches a failed add and toasts err.message, so no caller sees the error.
export function guardPlainAdds(cart: object) {
	const methods = cart as Record<'addToCart' | 'addAddOn', Add | undefined>
	for (const name of ['addToCart', 'addAddOn'] as const) {
		const add = methods[name]?.bind(cart)
		if (!add) continue
		methods[name] = async (q) => {
			try {
				return await add(q)
			} catch (err) {
				if ((err as { code?: unknown } | null)?.code !== 'design_required') throw err
				if (q?.productId != null) refused.add(String(q.productId))
				throw Object.assign(new Error(DESIGN_FIRST), { code: 'design_required', status: 409 })
			}
		}
	}
}
