import { describe, expect, it } from 'vitest'
import { guardPlainAdds, madeToDesign } from '$lib/product/designable'

const refusing = (err: unknown) => ({
	added: [] as unknown[],
	async addToCart(q: unknown) {
		this.added.push(q)
		throw err
	}
})

describe('a product made to a design', () => {
	it('is told by its own flag, and an absent flag is not designable', () => {
		expect(madeToDesign({ id: '1', designable: true })).toBe(true)
		expect(madeToDesign({ id: '1', designable: false })).toBe(false)
		expect(madeToDesign({ id: '1' })).toBe(false)
		expect(madeToDesign(null)).toBe(false)
	})

	it('refused plain by the engine reads as design it first, and its cards turn to Design yours', async () => {
		const engineWords = Object.assign(new Error('this product is made to your design; design it before adding it to the bag'), {
			code: 'design_required',
			status: 409
		})
		const cart = refusing(engineWords)
		guardPlainAdds(cart)

		expect(madeToDesign({ id: 41 })).toBe(false)
		const err = await cart.addToCart({ productId: 41, variantId: 7, qty: 1 }).catch((e) => e)

		expect(err.message).toBe('This one is made to your design. Design it first.')
		expect(err.code).toBe('design_required')
		expect(cart.added).toEqual([{ productId: 41, variantId: 7, qty: 1 }])
		expect(madeToDesign({ id: '41' })).toBe(true)
		expect(madeToDesign({ id: '42' })).toBe(false)
	})

	it('leaves every other refusal and every success as the engine gave it', async () => {
		const gone = Object.assign(new Error('that variant is not available'), { code: 'conflict' })
		const cart = refusing(gone)
		guardPlainAdds(cart)
		expect(await cart.addToCart({ productId: 43 }).catch((e) => e)).toBe(gone)
		expect(madeToDesign({ id: 43 })).toBe(false)

		const ok = { addToCart: async () => ({ id: 'cart-1' }) }
		guardPlainAdds(ok)
		expect(await ok.addToCart()).toEqual({ id: 'cart-1' })
	})
})
