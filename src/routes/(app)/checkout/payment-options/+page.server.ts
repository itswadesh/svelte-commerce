import { AddressService, CartService, OrdersService, PaymentMethodService } from '$lib/services'
import { loginUrl } from '$lib/config/index.js'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ url, request, locals, cookies, depends }) => {
	const { me, sid, store, storeId, origin, cartId } = locals
	let address
	let address_id = url.searchParams.get('address')
	const order_no = url.searchParams.get('order_no')
	let paymentMethods

	if (!me || !sid) {
		const redirectUrl = `${loginUrl}?ref=${url?.pathname}${url?.search || ''}`
		throw redirect(307, redirectUrl)
	}

	if (!address_id && !order_no) {
		throw redirect(307, '/checkout/address')
	}

	const cartRes = await CartService.fetchRefreshCart({
		cartId,
		origin,
		sid,
		storeId
	})

	if (!cartRes?.qty) {
		throw redirect(307, '/my/orders?sort=-updatedAt')
	}

	const cart = {
		cartId: cartRes.cart_id,
		items: cartRes?.items,
		qty: cartRes.qty,
		tax: cartRes.tax,
		subtotal: cartRes.subtotal,
		total: cartRes.total,
		currencySymbol: cartRes.currencySymbol,
		discount: cartRes.discount,
		savings: cartRes.savings,
		selfTakeout: cartRes.selfTakeout,
		shipping: cartRes.shipping,
		unavailableItems: cartRes.unavailableItems,
		formattedAmount: cartRes.formattedAmount
	}

	try {
		if (order_no) {
			const order = await OrdersService.fetchOrder({
				id: order_no,
				storeId,
				sid,
				origin
			})

			// console.log('order', order);

			if (order) {
				address_id = order.addressId
				address = order.address
			}
		} else {
			address = await AddressService.fetchAddress({
				id: address_id,
				storeId,
				server: true,
				sid,
				origin
			})
		}

		paymentMethods = await PaymentMethodService.fetchPaymentMethods({
			storeId,
			sid,
			origin
		})

		return { store, paymentMethods, address, addressId: address_id, me, cart }
	} catch (e) {
		return {
			paymentMethods,
			address,
			addressId: address_id,
			me,
			cart,
			err: e.data?.message || e.message
		}
	}
}

const codCheckout: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const comment = data.get('comment')
	const paymentMethod = data.get('paymentMethod')
	const prescriptionId = data.get('prescriptionId')
	const addressId = data.get('addressId')
	let cartId = locals.cartId
	let sid = cookies.get('connect.sid')

	// console.log(cartId);

	try {
		if (
			paymentMethod === 'COD' ||
			paymentMethod === 'manual' ||
			paymentMethod === 'BankTransfer' ||
			paymentMethod === 'Cashfree' ||
			paymentMethod === 'Phonepe' ||
			paymentMethod === 'Paypal' ||
			paymentMethod === 'Razorpay'
		) {
			if (paymentMethod === 'COD' || paymentMethod === 'manual') {
				try {

					const res = await OrdersService.codCheckout({
						address: addressId,
						cartId: cartId,
						paymentMethod: 'COD',
						prescription: prescriptionId,
						origin: locals.origin,
						storeId: locals.storeId
					})

					// console.log('res of cod',res.id,res._id, res)

					redirect(307, `/payment/success?orderId=${res?._id || res?.id}&status=PAYMENT_SUCCESS&provider=COD`)
				} catch (e) {

				} finally {
				}
			} else if (paymentMethod === 'BankTransfer') {
				if (comment) {
					try {

						const res = await OrdersService.codCheckout({
							address: addressId,
							cartId: cartId,
							comment,
							paymentMethod: 'COD',
							prescription: prescriptionId,
							origin: locals.origin,
							storeId: locals.storeId
						})

						// console.log('res of cod', res)

						redirect(307,
							`/payment/success?orderId=${res?._id || res?.id}&status=PAYMENT_SUCCESS&provider=COD`
						)
					} catch (e) {

					} finally {
					}
				} else {
					toast('Please enter your transaction id to place your order', 'info')

					commentMissing = true

					setTimeout(() => {
						commentMissing = false
					}, 820)
				}
			} else if (paymentMethod === 'Cashfree') {
				try {
					data.err = null
					loading = true
					loadingForPaymentProcessingSteps = true

					const res = await OrdersService.cashfreeCheckout({
						address: addressId,
						orderNo,
						origin: locals.origin,
						storeId: locals.storeId,
						cartId: locals.cartId
					})

					orderNo = res.order_no || ''

					if (!res.payment_session_id) {
						data.err = 'Payment failed. Try again'
						toast('Payment failed. Try again', 'error')
					}

					const cashfree = Cashfree({ mode: res.payment_mode })

					cashfree
						.checkout({
							paymentSessionId: res.payment_session_id,
							redirectTarget: '_parent',
							returnUrl: res.order_meta?.return_url
						})
						.then(function () { })

					// if (res?.redirectUrl && res?.redirectUrl !== null) {
					// 	goto(`${res?.redirectUrl}`)
					// } else {
					// 	toast('Something went wrong', 'error')
					// }
				} catch (e) {
					data.err = e
					toast(`Payment failed, please try again`, 'error')
					gotoOrder(orderNo)

					// goto(`/payment/failed?id=${data.addressId}&status=PAYMENT_PENDING&provider=Cashfree`)
				} finally {
					loading = false
				}
			} else if (paymentMethod === 'Phonepe') {
				try {
					data.err = null
					loading = true
					loadingForPaymentProcessingSteps = true
					const res = await OrdersService.phonepeCheckout({
						address: addressId,
						origin: locals.origin,
						cartId: locals.cartId,
						storeId: locals.storeId,
						orderNo
					})

					// console.log('res of Phonepe', res)

					if (res?.redirectUrl && res?.redirectUrl !== null) {
						goto(`${res?.redirectUrl}`)
					} else {
						toast('Something went wrong', 'error')
					}
				} catch (e) {
					data.err = e
					gotoOrder(orderNo)
				} finally {
					loading = false
				}
			} else if (paymentMethod === 'Paypal') {
				try {
					data.err = null
					loading = true
					loadingForPaymentProcessingSteps = true

					const res = await OrdersService.paypalCheckout({
						address: addressId,
						origin: locals.origin,
						storeId: locals.storeId
					})

					// console.log('res of Paypal', res)

					if (res?.redirect_url && res?.redirect_url !== null) {
						goto(`${res?.redirect_url}`)
					} else {
						toast('Something went wrong', 'error')
					}
				} catch (e) {
					data.err = e
					gotoOrder(orderNo)
				} finally {
					loading = false
				}
			} else if (paymentMethod === 'Razorpay') {
				try {
					data.err = null
					loading = true
					loadingForPaymentProcessingSteps = true

					const rp = await OrdersService.razorpayCheckout({
						address: addressId,
						orderNo,
						cartId: locals.cartId,
						origin: locals.origin,
						storeId: locals.storeId
					})

					orderNo = rp.order_no || ''
					gotoOrder(orderNo)

					const options = {
						key: rp.keyId, // Enter the Key ID generated from the Dashboard
						description: `Order ${orderNo}`,
						amount: rp.amount,
						order_id: rp.id,
						async handler(response) {
							try {
								const capture = await OrdersService.razorpayCapture({
									rpOrderId: response.razorpay_order_id,
									rpPaymentId: response.razorpay_payment_id,
									origin: locals.origin,
									storeId: locals.storeId
								})

								toast('Payment success', 'success')
								goto(`/payment/process?pg=razorpay&order_no=${capture.order_no}`)
							} catch (e) {
								data.err = e
							} finally {
							}
						},
						prefill: {
							name: `${data.me.firstName} ${data.me.lastName}`,
							phone: data.me.phone,
							email: data.me.email || data.address.email || 'help@zapvi.in',
							contact: data.me.phone
						}
					}

					const rzp1 = new Razorpay(options)
					rzp1.open()
				} catch (e) {
					data.err = e
					toast(`Payment failed, please try again`, 'error')
					gotoOrder(orderNo)
				} finally {
					loading = false
				}
			}
		} else {
			paymentDenied = true

			setTimeout(() => {
				paymentDenied = false
			}, 820)
		}
	} catch (e) {
		return {}
	}
}

export const actions: Actions = { codCheckout }
