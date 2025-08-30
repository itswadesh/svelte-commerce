import { getContext, onDestroy, onMount, setContext } from 'svelte'
import { toast } from 'svelte-sonner'
import { cartService } from '$lib/core/services'
import type { Cart } from '$lib/core/types'
const initialCart: Cart = {
	id: '',
	lineItems: [],
	subtotal: 0,
	total: 0,
	email: null,
	phone: null,
	billingAddressId: null,
	shippingAddressId: null,
	regionId: null,
	userId: null,
	salesChannelId: null,
	storeId: null,
	couponCode: null,
	discountAmount: 0,
	savingAmount: 0,
	shippingCost: null,
	returnAllowed: false,
	replaceAllowed: false,
	originCountry: null,
	weightUnit: 'g',
	dimensionUnit: 'cm',
	metadata: null,
	collectionId: null
}
export class Cart2State {
	cart = $state<Cart>(initialCart)
	isUpdatingCart = $state<boolean>(true)
	updatingItem = $state<Record<string, any>>({})
	isOpen = $state<boolean>(false)
	addToCartMessage = $state<string>('Add to cart')
	showCheckout = $state<boolean>(false)
	hasLoaded: Promise<void>

	async setSelectedPaymentMethod(code: string) {
		try {
			const cartId = this.cart?.id
			if (!cartId) return
			const c = await cartService.updateCartPaymentMethod({ cartId, paymentMethod: code })
			this.cart = c
		} catch (e: any) {
			toast.error(e?.message || 'Failed to save payment method')
		}
	}
	retrieveCartId = () => {
		const cartId = localStorage.getItem('cart_id') || null
		return cartId
	}

	constructor() {
		this.hasLoaded = new Promise((res, rej) => {
			onMount(async () => {
				try {
					this.isUpdatingCart = true
					this.resetSingleItemCheckoutSession()
					const cartId = this.retrieveCartId()
					if (cartId) {
						try {
							const c = await cartService.getCartByCartId(cartId)
							// console.log('🚀 ~ CartState ~ fetch ~ c:', c)
							if (!c.hasOwnProperty('message')) this.cart = c
						} catch (e) {}
					}
					res()
				} catch (e) {
					// console.log('🚀 ~ CartState ~ error ~ e:', e)
					rej()
				} finally {
				}
				this.isUpdatingCart = false
			})
		})
	}

	async refershCart() {
		try {
			this.isUpdatingCart = true
			const cartId = this.retrieveCartId()
			if (cartId) {
				try {
					const c = await cartService.refereshCart()
					// console.log('🚀 ~ CartState ~ fetch ~ c:', c)
					this.cart = c
				} catch (e) {}
			}
		} catch (e) {
			// console.log('🚀 ~ CartState ~ error ~ e:', e)
		} finally {
		}
		this.isUpdatingCart = false
	}

	async add({ qty, productId, variantId, lineId }: any) {
		// console.log('🚀 ~ CartState ~ add:', productId, variantId, qty, lineId)
		// if (this.cart.lineItems.some((item) => item.productId === product.id)) {
		//   this.cart.lineItems.find((item) => item.productId === product.id).qty += qty
		// } else {
		//   this.cart.lineItems.push({ qty, product, variant })
		// }
		if (!this.cart?.lineItems) this.cart = { ...this.cart, lineItems: [] }
		let cart_item = this.cart.lineItems.find((item: any) => item?.id === lineId)
		if (!cart_item) {
			cart_item = this.cart.lineItems.find((item: any) => {
				item?.productId === productId && item?.variantId === variantId
			})
			lineId = cart_item?.id
		}
		const cart_qty = cart_item?.qty || 0
		if (lineId && cart_qty < 2 && qty < 1) {
			// if qty is 1 or less then remove the item from cart
			qty = -9999999
		}
		// this.isUpdatingCart = true
		this.addToCartMessage = 'Adding to cart...'
		this.updatingItem[lineId] = true
		try {
			const c = await cartService.addToCart({
				cartId: this.cart.id,
				lineId: lineId,
				qty,
				productId: productId,
				variantId: variantId
			})
			// console.log('🚀 ~ CartState ~ add ~ c:', c)
			this.cart = c
			this.addToCartMessage = 'Proceed to checkout'
			this.showCheckout = true
			setTimeout(() => {
				this.addToCartMessage = 'Add to cart'
				this.showCheckout = false
			}, 5000)
		} catch (e) {
			toast.error(e?.message)
			this.addToCartMessage = 'Add to cart'
		} finally {
			// this.isUpdatingCart = false
			this.updatingItem[lineId] = false
		}
	}

	async update({ qty, lineId, productId, variantId, isSelectedForCheckout = true }: any) {
		// console.log('🚀 ~ CartState ~ update:', { lineId, qty, productId, variantId })
		try {
			// this.isUpdatingCart = true
			this.addToCartMessage = 'Adding to cart...'
			this.updatingItem[lineId] = true
			const c = await cartService.updateCart({
				cartId: this.cart.id,
				lineId,
				qty,
				productId,
				variantId,
				isSelectedForCheckout
			})
			// console.log('🚀 ~ CartState ~ add ~ c:', c)
			this.cart = c
			// this.addToCartMessage = 'Added to cart'
			this.addToCartMessage = 'Proceed to checkout'
			this.showCheckout = true
			setTimeout(() => {
				this.addToCartMessage = 'Add to cart'
				this.showCheckout = false
			}, 5000)
		} catch (e) {
			toast.error(e?.message)
			this.addToCartMessage = 'Add to cart'
		} finally {
			// this.isUpdatingCart = false
			this.updatingItem[lineId] = false
		}
	}

	// async completeCart({ cart_id }: any) {
	//   try {
	//     this.isUpdatingCart = true
	//     const c = await cartService.completeCart({ cart_id })
	//     this.cart = c
	//   } catch (e) {
	//     toast.error(e.message)
	//     throw e.message
	//   } finally {
	//     this.isUpdatingCart = false
	//   }
	// }

	async updateEmail({ email, phone }: any) {
		// console.log('🚀 ~ CartState ~ update:', email)
		try {
			this.isUpdatingCart = true
			const c = await cartService.updateCart2({ email, phone })
			// console.log('🚀 ~ CartState ~ add ~ c:', c)
			this.cart = c
		} catch (e) {
			toast.error(e.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async applyCoupon(couponCode: string) {
		// console.log('🚀 ~ CartState ~ update:', couponCode)
		try {
			this.isUpdatingCart = true
			const cartId = this.retrieveCartId()
			const c = await cartService.applyCoupon({ cartId, couponCode })
			// const couponData = await couponService.getCoupon(couponCode);
			// const currentUsage = couponData?.used || 0;
			// const res = await couponService.patchCoupon(couponCode, { used: currentUsage + 1 });
			// console.log('🚀 ~ CartState ~ res ~ c:', res)
			this.cart = c
			return c
		} catch (e) {
			// console.log(e)
			toast.error(e?.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async removeCoupon() {
		try {
			this.isUpdatingCart = true
			const c = await cartService.removeCoupon()
			this.cart = c
		} catch (e: any) {
			toast.error(e.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async updateShippingAddress({ shippingAddress, billingAddress, isBillingAddressSameAsShipping = true }: any) {
		// console.log('🚀 ~ CartState ~ updateBillingAddress:', billingAddress)
		// console.log('🚀 ~ CartState ~ updateShippingAddress:', shippingAddress)
		try {
			this.isUpdatingCart = true
			const c = await cartService.updateCart2({
				shippingAddress,
				billingAddress,
				isBillingAddressSameAsShipping
			})
			// console.log('🚀 ~ CartState ~ add ~ c:', c) // {  ...c }

			const cart = await cartService.getCartByCartId(c.id)
			this.cart = { ...cart }
		} catch (e) {
			toast.error(e.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async addOrUpdate({ productId, variantId, qty }: any) {
		const line_item = this.cart?.lineItems?.find?.(item => item?.productId === productId && item?.variantId === variantId)
		if (line_item) {
			await this.update({
				qty: qty + line_item.qty,
				lineId: line_item.id,
				productId: productId,
				variantId: variantId
			})
		} else {
			await this.add({ qty, productId, variantId })
		}
		// try {
		//   this.isUpdatingCart = true
		//   const c = await cartService.updateCartService({ lineId, qty })
		//   console.log('🚀 ~ CartState ~ add ~ c:', c)
		//   this.cart = c
		// } catch (e) {
		//   // toast.error(e.message)
		//   throw e.message
		// } finally {
		//   this.isUpdatingCart = false
		// }
	}

	async remove({ cartId, lineId }: any) {
		try {
			this.isUpdatingCart = true
			const c = await cartService.removeCart({ cartId, lineId })
			// console.log('🚀 ~ CartState ~ removed:', c)
			this.cart = c
		} catch (e) {
			// console.log(e)
			toast.error(e?.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
			this.showCheckout = false
		}
	}

	async clear() {
		try {
			this.isUpdatingCart = true
			this.cart = null
			localStorage.removeItem('cart_id')
			// console.log('🚀 ~ CartState ~ removed:', c)
			this.cart = initialCart
		} catch (e) {
			toast.error(e.message)
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async setShippingRate({ shippingRateId }: any) {
		try {
			this.isUpdatingCart = true
			const c = await cartService.updateShippingRate({ shippingRateId, cartId: this.cart.id })
			this.cart = c
		} catch (e) {
			throw e.message
		} finally {
			this.isUpdatingCart = false
		}
	}

	async createSingleItemCheckoutSession({ productId, variantId, qty }: any) {
		try {
			this.isUpdatingCart = true

			// save cart id to local storage as prev_cart_id
			const cartId = this.retrieveCartId()
			if (cartId) {
				localStorage.setItem('prev_cart_id', cartId)
				localStorage.removeItem('cart_id')
			}

			// create new cart
			const cart = await cartService.addToCart({
				qty: qty,
				productId,
				variantId,
				lineId: null
			})

			this.cart = cart
		} catch (error) {
			console.log('🚀 ~ CartState ~ createSingleItemCheckoutSession ~ error:', error)
			toast.error(error?.message)
		} finally {
			this.isUpdatingCart = false
		}
	}

	async resetSingleItemCheckoutSession() {
		try {
			this.isUpdatingCart = true
			const prev_cart_id = localStorage.getItem('prev_cart_id')
			if (prev_cart_id) {
				localStorage.setItem('cart_id', prev_cart_id)
				localStorage.removeItem('prev_cart_id')
			}
			this.cart = initialCart
		} catch (error) {
			console.log('🚀 ~ CartState ~ resetSingleCartSession ~ error:', error)
			toast.error(error?.message || 'Error resetting cart')
		} finally {
			this.isUpdatingCart = false
		}
	}

	async restorePrevCart() {
		try {
			this.isUpdatingCart = true
			const prev_cart_id = localStorage.getItem('prev_cart_id')
			if (prev_cart_id) {
				const cart = await cartService.getCartByCartId(prev_cart_id)
				this.cart = cart
				localStorage.setItem('cart_id', prev_cart_id)
				localStorage.removeItem('prev_cart_id')
			}
		} catch (error) {
			console.log('🚀 ~ CartState ~ restorePrevCart ~ error:', error)
			toast.error(error?.message || 'Error restoring cart')
		} finally {
			this.isUpdatingCart = false
		}
	}

	// remove(item_id: string, qty: number) {
	//   const timeout = this.cartToTimeoutMap.get(item_id)
	//   if (timeout) {
	//     clearTimeout(timeout)
	//     this.cartToTimeoutMap.delete(item_id)
	//   }
	//   this.cart_items = this.cart_items.filter((cart) => cart.item_id !== item_id)
	//   this.summary = calculateSummary(this.cart_items)
	// }
}

const CART_KEY = Symbol('CART')

export function setCartState() {
	return setContext(CART_KEY, new Cart2State())
}

export function getCartState() {
	// console.log(CART_KEY)
	return getContext<ReturnType<typeof setCartState>>(CART_KEY)
}
