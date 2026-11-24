import { goto } from '$app/navigation'
import { toast } from 'svelte-sonner'
import { checkoutService } from '$lib/core/services'
import { coveredByGiftCard } from '$lib/utils/price'
import { offerEngineMethod, offerWhatsApp, placeWhatsAppOrder, WHATSAPP } from '$lib/checkout/whatsapp'
import type { LiveQuote } from '$lib/checkout/quote.svelte'

// What placing an order needs from core's PaymentModule. Shared by the payment step and the
// one-page checkout (GoCommerce D328), so the two layouts place an order the same way.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PaymentModule = any

export const UPI = 'UPI'
export const PARTIAL = 'COD_PARTIAL'

/** Once the connector's list is in, Order on WhatsApp (D255) and Pay by UPI (D277) join it when the store has them on. Call inside an $effect. */
export function offerStoreMethods(paymentModule: PaymentModule) {
	if (paymentModule.loadingForPaymentMethods) return
	offerWhatsApp(paymentModule)
	offerEngineMethod(paymentModule, 'upi', UPI, 'Pay from any UPI app with a QR code or a tap, then enter the UPI reference.', '/payment/upi.svg')
}

// `placeOrder` sets `paymentLoader = true` up front, but its "gateway not ready yet" branches
// (Razorpay flips `razorpayReady` a second after its script loads; Affirm checks a global) only
// toast and return — the reset lives in the success path's `finally`. Tapping Confirm Order too
// early therefore left the button spinning and disabled forever, with no way to place the order
// short of a full reload. Clearing it here covers every early-return branch at once. On the
// success path the reset is harmless: the flow has either navigated away or handed off to the
// gateway's own modal, which is the active UI at that point.
export async function placeOrder(paymentModule: PaymentModule, quote: LiveQuote) {
	quote.expectShownTotal(paymentModule.cartState.cart?.id)
	try {
		if (coveredByGiftCard(quote.current)) return await placeCovered(paymentModule, quote)
		if (paymentModule.SELECTED_PG_CODE === WHATSAPP) return await placeWhatsApp(paymentModule)
		if (paymentModule.SELECTED_PG_CODE === UPI) return await placeUpi(paymentModule)
		if (paymentModule.SELECTED_PG_CODE === PARTIAL) return await placePartialCod(paymentModule)
		await paymentModule.placeOrder()
	} finally {
		paymentModule.paymentLoader = false
	}
}

const success = (orderNo: string, cartId?: string) =>
	goto(`/checkout/success?order_no=${encodeURIComponent(orderNo)}&cart_id=${encodeURIComponent(cartId ?? '')}`)

/**
 * A gift card that pays for everything (D250). The engine marks the order paid with no gateway
 * step, whichever switched-on method it is placed under, so it goes under the one the total was
 * quoted for, or else one that adds no charge: a method's fee would move the total off zero.
 */
async function placeCovered(paymentModule: PaymentModule, quote: LiveQuote) {
	const cartId = paymentModule.cartState.cart?.id
	const methods: { code: string; engineCode?: string; fee?: number }[] = paymentModule.allPaymentMethods ?? []
	const method = methods.find((m) => m.code === quote.method) ?? methods.find((m) => !(Number(m.fee) > 0)) ?? methods[0]
	const svc = checkoutService as unknown as { checkout: (code: string, args: { cartId?: string }) => Promise<{ orderNo: string }> }
	paymentModule.paymentLoader = true
	try {
		const placed = await svc.checkout(method?.engineCode || method?.code || 'cod', { cartId })
		await success(placed.orderNo, cartId)
	} catch (err) {
		toast.error((err as Error)?.message || 'Your order could not be placed. Please try again.')
	}
}

/** Order on WhatsApp: the success page then offers the chat with the order written in. */
async function placeWhatsApp(paymentModule: PaymentModule) {
	const cartId = paymentModule.cartState.cart?.id
	paymentModule.paymentLoader = true
	try {
		await success(await placeWhatsAppOrder(cartId), cartId)
	} catch (err) {
		toast.error((err as Error)?.message || 'Your order could not be placed. Please try again.')
	}
}

/** Pay by UPI: the success page then shows the QR code, the app button and the reference box. */
async function placeUpi(paymentModule: PaymentModule) {
	const cartId = paymentModule.cartState.cart?.id
	const svc = checkoutService as unknown as { checkout: (code: string, args: { cartId?: string }) => Promise<{ orderNo: string }> }
	paymentModule.paymentLoader = true
	try {
		const placed = await svc.checkout('upi', { cartId })
		await success(placed.orderNo, cartId)
	} catch (err) {
		toast.error((err as Error)?.message || 'Your order could not be placed. Please try again.')
	}
}

/**
 * Part-paid cash on delivery (GoCommerce D297). The engine names the gateway that takes the
 * advance, Razorpay or Cashfree, and this runs that gateway's own window for the advance alone,
 * as core's PaymentModule does for the gateway's own method; the rest is paid in cash.
 */
type Advance =
	| { gateway: 'razorpay'; order_no: string; id: string; key_id: string; amount: number; currency: string }
	| { gateway: 'cashfree'; order_no: string; payment_session_id: string; environment?: string }
async function placePartialCod(paymentModule: PaymentModule) {
	const cartId = paymentModule.cartState.cart?.id ?? ''
	const cart = paymentModule.cartState.cart as { name?: string; phone?: string; email?: string; shippingAddress?: { phone?: string; email?: string; firstName?: string } } | undefined
	const svc = checkoutService as unknown as { checkoutCodPartial: (args: { cartId?: string; origin?: string }) => Promise<Advance> }
	const w = window as unknown as { Razorpay?: new (o: object) => { open(): void }; Cashfree?: (o: object) => { checkout(o: object): Promise<{ error?: { message?: string }; paymentDetails?: unknown }> } }
	const processed = (gateway: string, orderNo: string) =>
		goto(`/checkout/process?pg=${gateway}&order_no=${encodeURIComponent(orderNo)}&cart_id=${encodeURIComponent(cartId)}`)
	paymentModule.paymentLoader = true
	try {
		const pay = await svc.checkoutCodPartial({ cartId, origin: window.location.origin })
		if (pay.gateway === 'razorpay') {
			if (!w.Razorpay) await loadScript('https://checkout.razorpay.com/v1/checkout.js')
			if (!w.Razorpay) throw new Error('The payment window could not be loaded. Please try again.')
			new w.Razorpay({
				key: pay.key_id,
				amount: pay.amount,
				currency: pay.currency,
				order_id: pay.id,
				description: `Advance for order #${pay.order_no}`,
				handler: () => processed('razorpay', pay.order_no),
				prefill: {
					name: cart?.name || cart?.shippingAddress?.firstName || '',
					contact: cart?.phone || cart?.shippingAddress?.phone || '',
					email: cart?.email || cart?.shippingAddress?.email || ''
				}
			}).open()
			return
		}
		await paymentModule.loadCashfreeScript()
		if (!w.Cashfree) throw new Error('The payment window could not be loaded. Please try again.')
		const result = await w.Cashfree({ mode: pay.environment === 'sandbox' ? 'sandbox' : 'production' }).checkout({
			paymentSessionId: pay.payment_session_id,
			redirectTarget: '_modal'
		})
		if (result.error) toast.error(result.error.message || 'Payment closed or failed')
		if (result.paymentDetails) await processed('cashfree', pay.order_no)
	} catch (err) {
		toast.error((err as Error)?.message || 'Your order could not be placed. Please try again.')
	}
}

function loadScript(src: string) {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = script.onerror = () => resolve()
		document.head.appendChild(script)
	})
}
