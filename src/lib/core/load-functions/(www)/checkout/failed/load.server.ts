import type { PageServerLoad } from "../../../../../../routes/(www)/checkout/failed/$types"

export const load: PageServerLoad = async ({ url }) => {
	const cartId = url.searchParams.get('cart_id')
	return {
		cartId
	}
}
