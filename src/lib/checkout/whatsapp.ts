// Order on WhatsApp (GoCommerce D255): the engine confirms the order like cash on delivery and
// answers with a wa.me link that opens the shop's chat with the order written in. The connector's
// payment list offers only the flows it drives, so the method is added here from the engine's own
// list, and placed through the connector's generic checkout, which hands back that link.
import { checkoutService } from '$lib/core/services/index.js'

export const WHATSAPP = 'WHATSAPP'

type Module = {
	allPaymentMethods: { code?: string }[]
	showError: boolean
	errorMessage: string
	showPaymentMethods: boolean
	SELECTED_PG_CODE: string
}
type Checkout = {
	listMethods?: () => Promise<{ methods: { code: string; name: string }[] }>
	checkout: (code: string, args: { cartId?: string }) => Promise<{ orderNo: string; payment?: { clientData?: Record<string, string> } }>
}
const svc = checkoutService as unknown as Checkout

/** Adds Order on WhatsApp to the payment step when the store has it switched on. */
export const offerWhatsApp = (pm: Module) =>
	offerEngineMethod(pm, 'whatsapp', WHATSAPP, 'Send the order to the shop on WhatsApp, and agree there how you pay.', '/payment/whatsapp.svg')

/**
 * Adds a method the connector does not list (it lists only the flows it drives) to the payment
 * step, from the engine's own list, when the store has it switched on: Order on WhatsApp, Pay by UPI.
 */
export async function offerEngineMethod(pm: Module, engineCode: string, code: string, description: string, img: string) {
	if (!svc.listMethods || pm.allPaymentMethods.some((m) => m.code === code)) return
	const engine = await svc.listMethods().catch(() => null)
	const method = engine?.methods?.find((m) => m.code === engineCode)
	if (!method || pm.allPaymentMethods.some((m) => m.code === code)) return
	const alone = pm.allPaymentMethods.length === 0
	const offered = {
		id: engineCode,
		code,
		engineCode,
		name: method.name,
		title: method.name,
		description,
		img,
		fee: 0,
		active: true,
		isActive: true
	}
	pm.allPaymentMethods = [...pm.allPaymentMethods, offered]
	// The connector offered nothing it can drive, so the step said there was no way to pay.
	if (alone) {
		pm.showError = false
		pm.errorMessage = ''
		pm.showPaymentMethods = true
		pm.SELECTED_PG_CODE = code
	}
}

const key = (orderNo: string) => `gocommerce_whatsapp_${orderNo}`

/** Places the order and keeps its WhatsApp link for the success page; answers the order number. */
export async function placeWhatsAppOrder(cartId: string | undefined) {
	const placed = await svc.checkout('whatsapp', { cartId })
	const link = placed.payment?.clientData?.whatsapp_url
	if (link) {
		try {
			localStorage.setItem(key(placed.orderNo), link)
		} catch {
			// A browser that keeps nothing still has the order; the page says what happens next.
		}
	}
	return placed.orderNo
}

/** The WhatsApp link of an order placed in this browser, or ''. */
export function whatsappLinkFor(orderNo: string | null | undefined) {
	if (!orderNo) return ''
	try {
		const link = localStorage.getItem(key(orderNo)) ?? ''
		return link.startsWith('https://wa.me/') ? link : ''
	} catch {
		return ''
	}
}
