import { getContext, onDestroy, onMount, setContext } from 'svelte'

export class ProductState {
	cart = $state<{ cart_id: string; lineItems: any[] }>({ cart_id: '0', lineItems: [] })
	isUpdatingProduct = $state<boolean>(false)

	retrieveCartId = () => {
		const cartId = localStorage.getItem('cart_id') || null
		return cartId || ''
	}

	startPaymentSession = async () => {
		try {
			const cartId = this.retrieveCartId()
		} catch (e) {
			console.log(`Error startPaymentSession: ${e}`)
		}
	}

	setPaymentSession = async (paymentProvider: string) => {
		try {
			const cartId = this.retrieveCartId()
		} catch (e) {
			console.log(`Error setPaymentSession: ${e}`)
		}
	}

	completeCartCheckout = async () => {
		try {
			const cartId = this.retrieveCartId()
			localStorage.clear()
		} catch (e) {
			console.log(`Error completeCartCheckout: ${e}`)
			throw e
		}
	}
}

const PRODUCT_KEY = Symbol('PRODUCT')

export function setProductState() {
	return setContext(PRODUCT_KEY, new ProductState())
}

export function getProductState() {
	return getContext<ReturnType<typeof setProductState>>(PRODUCT_KEY)
}
