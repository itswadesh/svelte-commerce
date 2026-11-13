/**
 * Facts about the store that the product page states, read from what the connector serves. Each
 * answers false when the connector has no such list or it cannot be read, so the page says nothing
 * it was not told.
 */

/** Whether the store takes cash on delivery: one of the payment methods it has switched on. */
export async function takesCashOnDelivery(services: object): Promise<boolean> {
	try {
		const listed: any = await (services as any).paymentMethodService?.list?.()
		return (listed?.data ?? []).some((m: any) => String(m?.code).toUpperCase() === 'COD')
	} catch {
		return false
	}
}
