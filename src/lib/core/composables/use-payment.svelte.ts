import { getCartState } from '$lib/core/stores/cart.svelte'
import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import { toast } from 'svelte-sonner'
import { checkoutService, couponService } from '$lib/core/services'
import { browser } from '$app/environment'
import { paymentMethodService } from '$lib/core/services'
import { page } from '$app/state'
import { injectAffirm } from '../utils/affirm-injector'

// Define interfaces for better type safety
interface Cart {
	id: string
	name?: string
	phone?: string
	email?: string
	shippingAddress?: {
		name?: string
		phone?: string
		email?: string
		country?: string
		countryCode?: string
	}
	shippingAddressId?: string
}

interface CartState {
	cart: Cart
	removeCoupon: () => void
	setShippingRate: (params: { shippingRateId: string }) => Promise<void>
	createSingleItemCheckoutSession: (params: { productId: string; variantId: string; qty: number }) => Promise<void>
	restorePrevCart: () => Promise<void>
}

interface PaymentMethod {
	img: any
	name: string
	apiKey?: string
	isTest?: boolean
}

// Declare affirm as global
declare global {
	interface Window {
		Razorpay: any
		affirm: any
	}
	const affirm: any
}

export class PaymentModule {
	cartState = getCartState() as CartState
	SELECTED_PG_NAME: string = $state('')
	listOfPaymentMethods: PaymentMethod[] = $state([])
	paymentLoader = $state(false)
	loadingForCart = $state(false)
	payment_sessions = []
	editAddress = $state(false)
	razorpayReady = $state(false)
	order_no = $state('')
	showError = $state(false)
	errorMessage = $state('')
	checkoutDisabled = $state(false)
	showPaymentMethods = $state(false)
	couponCode = $state('')
	showCouponInput = $state(false)
	coupons = $state<any>([])
	shippingRates = $state({})
	affirmPaymentMethod: PaymentMethod | null = null

	constructor() {
		onMount(async () => {
			if (browser) {
				const allPaymentMethods: any = await paymentMethodService.list({})
				this.listOfPaymentMethods = allPaymentMethods?.data || []

				// Filter out Affirm Pay if country is not USA
				const shippingAddress = this.cartState?.cart?.shippingAddress
				if (shippingAddress && shippingAddress?.country !== 'USA' && shippingAddress?.countryCode !== 'US') {
					this.listOfPaymentMethods = this.listOfPaymentMethods.filter((method: PaymentMethod) => method?.name?.toUpperCase?.() !== 'AFFIRMPAY')
				}

				if (this.listOfPaymentMethods.length === 0) {
					this.showError = true
					this.errorMessage = 'No payment methods available'
					this.checkoutDisabled = true
				} else if (this.listOfPaymentMethods.length === 1) {
					this.SELECTED_PG_NAME = this.listOfPaymentMethods?.[0]?.name
					this.showPaymentMethods = true
				} else {
					this.showPaymentMethods = true
				}
				if (this.listOfPaymentMethods.find((f: PaymentMethod) => f?.name?.toUpperCase?.() === 'RAZORPAY')) {
					const razorpayScript = document.createElement('script')
					razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js'
					razorpayScript.async = true
					razorpayScript.onload = () => {
						// Add a small delay to ensure the script is fully initialized
						setTimeout(() => {
							this.razorpayReady = true
						}, 1000)
					}
					document.head.appendChild(razorpayScript)
				}
				this.affirmPaymentMethod = this.listOfPaymentMethods.find((f: PaymentMethod) => f?.name?.toUpperCase?.() === 'AFFIRMPAY') || null
				if (this.affirmPaymentMethod) {
					// Only proceed with Affirm initialization if country is USA
					if (shippingAddress?.country === 'USA' || shippingAddress?.countryCode === 'US') {
            injectAffirm(this.affirmPaymentMethod.apiKey, this.affirmPaymentMethod.isTest)
					}
				}
			}
		})

		onMount(async () => {
			try {
				const res: any = await couponService.listCoupons({})
				if (res?.count > 0) {
					this.showCouponInput = true
					this.coupons = res?.data || []
				}
			} catch (e: any) {
				toast.error(e.message)
			} finally {
			}
		})

		$effect(() => {
			if (this.cartState?.cart?.id) {
				this.getShippingRates(this.cartState.cart.id)
			}
		})

		// Effect to update payment methods if shipping address country changes
		$effect(() => {
			const cartObj = this.cartState
			if (!cartObj) return

			const shippingAddress = cartObj.cart?.shippingAddress

			// If country is not USA, filter out Affirm Pay
			if (shippingAddress && shippingAddress?.country !== 'USA' && shippingAddress?.countryCode !== 'US') {
				this.listOfPaymentMethods = this.listOfPaymentMethods.filter((method: PaymentMethod) => method?.name?.toUpperCase?.() !== 'AFFIRMPAY')

				// If Affirm was selected, reset selection
				if (this.SELECTED_PG_NAME?.toUpperCase?.() === 'AFFIRMPAY') {
					this.SELECTED_PG_NAME = ''
				}
			}
		})
	}

	removeAppliedCoupon = () => {
		this.cartState?.removeCoupon()
	}

	placeOrder = async () => {
		if (!this.SELECTED_PG_NAME) {
			toast.error('Please select a payment method')
			return
		}
		if (!this.cartState) return

		this.paymentLoader = true
		if (this.SELECTED_PG_NAME?.toUpperCase?.() == 'RAZORPAY') {
			// Razorpay checkout
			if (!this.razorpayReady) {
				toast.error('Please wait till payment gateway is ready')
			} else {
				try {
					const rp: any = await checkoutService.checkoutRazorpay({
						cartId: this.cartState.cart.id,
						origin: page.url.origin
					})
					this.order_no = rp?.order_no || ''
					if (rp && rp !== null) {
						const cartId = this.cartState.cart.id
						const options = {
							key: rp.key_id, // Enter the Key ID generated from the Dashboard
							description: `Order #${this.order_no}`,
							amount: rp.amount * 80,
							order_id: rp.id,
							async handler(response: any) {
								// console.log('🚀 ~ captureRazorpayPayment ~ response:', response)
								try {
									const capture: any = await checkoutService.captureRazorpayPayment({
										razorpay_order_id: response.razorpay_order_id,
										razorpay_payment_id: response.razorpay_payment_id
									})
									goto(`/checkout/process?pg=razorpay&order_no=${capture?.order_no}&cart_id=${cartId}`)
								} catch (e: any) {
									toast.error(e.message)
								} finally {
								}
								// this.paymentLoader = false
							},
							prefill: {
								name: this.cartState.cart?.name || this.cartState.cart?.shippingAddress?.name || '',
								phone: this.cartState.cart?.phone || this.cartState.cart?.shippingAddress?.phone || '',
								email: this.cartState.cart?.email || this.cartState.cart?.shippingAddress?.email || ''
							}
						}

						if (typeof window.Razorpay === 'undefined') {
							toast.error('Payment gateway is not ready yet')
							return
						}
						const rzp1 = new window.Razorpay(options)
						rzp1.open()
					} else {
						toast.error('Something went wrong')
					}
				} catch (e: any) {
					toast.error(e.message)
				} finally {
					this.paymentLoader = false
				}
			}
		} else if (this.SELECTED_PG_NAME?.toUpperCase?.() === 'AFFIRMPAY') {
			if (typeof affirm === 'undefined' || !affirm) {
				toast.error('Affirm is not ready yet')
			} else {
				try {
					affirm.ui.error.on('close', () => {
						this.paymentLoader = false
					})

					const affirmPayOrder: any = await checkoutService.createAffirmPayOrder({
						cartId: this.cartState.cart.id,
						addressId: this.cartState.cart.shippingAddressId ?? '',
						origin: page.url.origin,
						storeId: page.data.storeId,
						paymentMethodId: 'AffirmPay'
					})

					if (this.affirmPaymentMethod?.apiKey) {
						affirmPayOrder.merchant.public_api_key = this.affirmPaymentMethod.apiKey
					}
					affirmPayOrder.currency = 'USD'

					console.log(affirmPayOrder)
					try {
						affirm.checkout(affirmPayOrder)
						affirm.checkout.open({
							onFail: async function (error: any) {
								this.paymentLoader = false
								toast.error(`Affirm Payment Failed`)
								await checkoutService.cancelAffirmOrder({
									orderId: affirmPayOrder?.order_id || '',
									storeId: page.data.storeId,
									origin: page.url.origin
								})
							},
							onSuccess: async function (success_object: any) {
								this.paymentLoader = false
								const res1 = await checkoutService.confirmAffirmOrder({
									affirmToken: success_object.checkout_token,
									orderId: affirmPayOrder?.order_id || '',
									storeId: page.data?.store?.id,
									origin: page.url.origin,
									// @ts-ignore - API might require this but TS doesn't know
									return_url: page.url.origin + '/checkout/success'
								})
								console.log('Affirm checkout success:', res1)
								goto(`/checkout/success?order_no=${affirmPayOrder?.order_id || ''}&status=PAYMENT_SUCCESS&provider=AffirmPay`)
							}
						})
					} catch (error) {
						console.error('Error initiating Affirm checkout:', error)
						this.paymentLoader = false
					}
				} catch (e: any) {
					toast.error(e.message)
					this.paymentLoader = false
				} finally {
					this.cartState?.restorePrevCart()
				}
			}
		} else if (this.SELECTED_PG_NAME?.toUpperCase?.() == 'PHONEPE') {
			// Phonepe checkout
			try {
				const pp: any = await checkoutService.checkoutPhonepe({
					cartId: this.cartState.cart.id,
					email: this.cartState.cart.email,
					phone: '8249028220',
					origin: page.url.origin
				})
				if (!pp) {
					toast.error('Something went wrong')
					return
				}
				const redirectUrl = pp?.redirectUrl
				// console.log('🚀 ~ placeOrder ~ orders', pp)
				if (redirectUrl && redirectUrl !== null) {
					window.location.href = redirectUrl
				} else {
				}
			} catch (e) {
				console.log(e)
			} finally {
				this.paymentLoader = false
			}
		} else if (this.SELECTED_PG_NAME?.toUpperCase?.() == 'STRIPE') {
			try {
				// Stripe chekout
				const sp: any = await checkoutService.checkoutStripe({
					cartId: this.cartState.cart.id,
					origin: page.url.origin
				})
				// console.log('🚀 ~ placeOrder ~ sp', sp)
				if (sp.url) {
					window.location.href = sp.url
				} else {
					toast.error('Something went wrong, please check if order is placed by checking your email or contact support')
				}
			} catch (e: any) {
				toast.error(e.message)
			} finally {
				this.paymentLoader = false
			}
		} else if (this.SELECTED_PG_NAME?.toUpperCase?.() == 'PAYPAL') {
			try {
				const res: any = await checkoutService.checkoutPaypal({
					cartId: this.cartState.cart.id,
					origin: page.url.origin,
					return_url: page.url.origin + '/checkout/success'
				})
				if (res?.redirect_url && res?.redirect_url !== null) {
					window.location.href = `${res.redirect_url}`
				} else {
					toast.error('Something went wrong, please check if order is placed by checking your email or contact support')
				}
			} catch (e: any) {
				toast.error(e.message || 'Payment Failed')
			} finally {
				this.paymentLoader = false
			}
		} else if (this.SELECTED_PG_NAME?.toUpperCase?.() == 'COD') {
			try {
				// COD chekout
				const cp: any = await checkoutService.checkoutCOD({
					cartId: this.cartState.cart.id,
					origin: page.url.origin
				})
				goto(`/checkout/process?pg=COD&order_no=${cp?.order_no}&cart_id=${this.cartState.cart.id}&store_id=${page.data.storeId}`)
			} catch (e: any) {
				toast.error(e.message)
			} finally {
				this.paymentLoader = false
			}
		}
	}

	getShippingRates = async (cartId: string) => {
		try {
			const res = await checkoutService.getShippingRates({ cartId })
			this.shippingRates = res || {}
		} catch (error) {
			console.log(error)
		}
	}

	handleShippingRateChange = async (rate: { id: string }) => {
		if (!this.cartState?.cart?.id) return

		try {
			// shipping address is overridden by setShippingRate
			// incase user is logged out this causes a problem
			// hence this hack
			const previousShippingAddress = this.cartState?.cart?.shippingAddress
			await this.cartState?.setShippingRate({ shippingRateId: rate.id })
			if (this.cartState.cart) {
				this.cartState.cart.shippingAddress = previousShippingAddress
			}

			toast.success('Shipping rate changed')
		} catch (e: any) {
			toast.error(e.message || 'Shipping rate failed')
		} finally {
		}
	}
}
