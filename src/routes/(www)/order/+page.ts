import { productService } from '$lib/core/services/index.js'
import { buildMenu } from '$lib/order/menu'
import type { PageLoad } from './$types'

// ponytail: a thousand products is ten pages of the catalogue's largest page; a store bigger than
// that wants search and categories, not one page, and gets the first thousand here.
const PAGE_SIZE = 100
const MAX_PAGES = 10

/** Every product the store sells, as the quick-order page's menu (GoCommerce D255). */
export const load: PageLoad = async () => {
	const products: any[] = []
	for (let page = 1; page <= MAX_PAGES; page++) {
		const res = await productService.list({ page, limit: PAGE_SIZE }).catch(() => null)
		products.push(...(res?.data ?? []))
		if (!res || page >= (Number(res.noOfPage) || 1)) break
	}
	return { menu: buildMenu(products) }
}
