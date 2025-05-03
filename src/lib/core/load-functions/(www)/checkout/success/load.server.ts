import { OrderService } from '$lib/core/services'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from '../../../../../../routes/(www)/checkout/success/$types'

export const load: PageServerLoad = async ({ url, fetch }) => {
	const failed = url.searchParams.get('failed')
	const cartId = url.searchParams.get('cart_id')
	const orderNo = url.searchParams.get('order_no')
	const redirectUrl = `/checkout/failed?cart_id=${cartId}&order_no=${orderNo}`

	if (failed) {
		redirect(307, redirectUrl)
	}

	try {
		const orderService = new OrderService(fetch)
		const orders = await orderService.listOrdersByParent({ orderNo, cartId })
		if (!orders?.data?.length) {
			throw new Error('failed')
		}

		return { orders }
	} catch (e: any) {
		if (e?.message === 'failed') {
			redirect(307, redirectUrl)
		}

		return { orders: { data: [] } }
	}
}

