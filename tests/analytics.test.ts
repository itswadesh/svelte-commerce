import { describe, it, expect, beforeEach } from 'vitest'
import { trackViewCart, trackViewItemList } from '$lib/analytics'

const w = window as any
const events = () => w.dataLayer.map((a: IArguments) => [...a])

beforeEach(() => {
	w.dataLayer = []
	w.gtag = function () {
		w.dataLayer.push(arguments)
	}
	sessionStorage.clear()
})

describe('trackViewCart', () => {
	const cart = { id: 'c1', subtotal: 1098, lineItems: [{ sku: 'TEE-M', name: 'Tee', price: 499, qty: 2 }, { productId: 'p9', title: 'Cap', price: 100, qty: 1 }] }

	it('sends view_cart with each line, by SKU, as begin_checkout does', () => {
		trackViewCart(cart, 'INR')
		expect(events()).toEqual([
			[
				'event',
				'view_cart',
				{
					currency: 'INR',
					value: 1098,
					items: [
						{ item_id: 'TEE-M', item_name: 'Tee', price: 499, quantity: 2 },
						{ item_id: 'p9', item_name: 'Cap', price: 100, quantity: 1 }
					]
				}
			]
		])
	})

	it('sends nothing for an empty bag', () => {
		trackViewCart({ id: 'c2', lineItems: [] }, 'INR')
		trackViewCart(null, 'INR')
		expect(events()).toEqual([])
	})
})

describe('trackViewItemList', () => {
	it('sends view_item_list with the list’s name and its products, by SKU', () => {
		trackViewItemList([{ sku: 'A-1', title: 'A', price: 10 }, { id: 'b', name: 'B', price: 20 }], 'Shirts', 'INR')
		expect(events()).toEqual([
			[
				'event',
				'view_item_list',
				{
					item_list_name: 'Shirts',
					currency: 'INR',
					items: [
						{ item_id: 'A-1', item_name: 'A', price: 10, index: 0 },
						{ item_id: 'b', item_name: 'B', price: 20, index: 1 }
					]
				}
			]
		])
	})

	it('sends nothing for an empty listing', () => {
		trackViewItemList([], 'Shirts', 'INR')
		expect(events()).toEqual([])
	})
})
