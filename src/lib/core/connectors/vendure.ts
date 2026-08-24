import {
	BaseService as VendureBaseService,
	PaymentMethodService as VendurePaymentMethodService,
	BlogService as VendureBlogService,
	CouponService as VendureCouponService,
	WishlistService as VendureWishlistService,
	MeilisearchService as VendureMeilisearchService,
	MenuService as VendureMenuService,
	PageService as VendurePageService,
	StoreService as VendureStoreService
} from '@misiki/vendure-connector'
import { staticStoreConfig } from './static-store'
import { blockLitekartRest, serveLitekartRestLocally } from './no-litekart-rest'
import { localStoreData } from './local-store-data'
import { withLocalPaymentIcons } from './payment-icons'

// Vendure-only connector: the stock @misiki/vendure-connector still calls Litekart REST endpoints
// (`/api/stores/public-details`, `/api/pages/*`, `/api/menu`, `/api/ms-autocomplete/*`,
// `/api/users/me`) — only its GraphQL `query()` helper targets the Vendure server. Without a
// Litekart API those relative calls fail, which is fatal for store resolution (hooks + root
// layout). This module is what `kitcommerce.config.ts` exposes as `services`: everything from the
// vendure connector, with the Litekart-REST-dependent services replaced by static data
// (default-store.json + kitcommerce.config.ts overrides) or delegated to Vendure-native calls.
export * from '@misiki/vendure-connector'

// What stays here is what only this storefront can answer: store identity and menus come from
// kitcommerce.config.ts + default-store.json, not from Vendure. Everything else — orders, the
// customer guard, the order number carried out of checkout, categories, profile — now lives in
// @misiki/vendure-connector itself (>= 2.0.36).

// Lets the hooks `init` verify the selected connector matches the PUBLIC_VENDURE_* env.
export const connectorName = 'vendure'

// Nothing in Vendure mode may fall through to a Litekart REST path: that API is not installed and
// not running. Reads return empty, writes fail loudly, and each unimplemented path is reported
// once — see no-litekart-rest.ts.
// Local data first — menus, countries, currencies, plugin toggles — then the guard.
serveLitekartRestLocally(localStoreData)
blockLitekartRest(VendureBaseService, 'vendure')

// Store identity overrides (name, logo, currency, menus, plugins…) belong in
// kitcommerce.config.ts's default export — see staticStoreConfig.
export class StoreService extends VendureStoreService {
	async getStoreByIdOrDomain(
		_params: Parameters<VendureStoreService['getStoreByIdOrDomain']>[0]
	): ReturnType<VendureStoreService['getStoreByIdOrDomain']> {
		return (await staticStoreConfig()) as unknown as Awaited<ReturnType<VendureStoreService['getStoreByIdOrDomain']>>
	}
}

export const storeService = new StoreService()

// Pages are Litekart CMS content with no Vendure equivalent. Loads that use these already render
// empty states for `{}`/`[]`; resolving statically keeps home/legal pages off the dead REST path.
export class PageService extends VendurePageService {
	async list(_options: Parameters<VendurePageService['list']>[0]): ReturnType<VendurePageService['list']> {
		return []
	}

	async listLatestPages(
		_options: Parameters<VendurePageService['listLatestPages']>[0]
	): ReturnType<VendurePageService['listLatestPages']> {
		return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 }
	}

	async getOne(_id: string): ReturnType<VendurePageService['getOne']> {
		return {} as unknown as Awaited<ReturnType<VendurePageService['getOne']>>
	}
}

export const pageService = new PageService()

// The nav (use-nav composable) reads `response.data` and filters on `menuId === 'header'`; serve
// the static store config's menus instead of the Litekart-only `/api/menu`.
export class MenuService extends VendureMenuService {
	async list(): ReturnType<VendureMenuService['list']> {
		const store = await staticStoreConfig()
		return { data: store.menu } as unknown as Awaited<ReturnType<VendureMenuService['list']>>
	}
}

export const menuService = new MenuService()

// `/api/ms-autocomplete/*` is the Litekart API's Meilisearch proxy; Vendure has no Meilisearch
// integration, so serve empty suggestions (the search renderer reads `res.data`).
export class MeilisearchService extends VendureMeilisearchService {
	async searchAutoComplete(
		_params: Parameters<VendureMeilisearchService['searchAutoComplete']>[0]
	): ReturnType<VendureMeilisearchService['searchAutoComplete']> {
		return { data: [] } as unknown as Awaited<ReturnType<VendureMeilisearchService['searchAutoComplete']>>
	}
}

export const meilisearchService = new MeilisearchService()

// Blogs are Litekart CMS content with no Vendure equivalent; the blog routes already render an
// empty state for `{ data: [] }`.
export class BlogService extends VendureBlogService {
	async list(_options: Parameters<VendureBlogService['list']>[0]): ReturnType<VendureBlogService['list']> {
		return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 } as unknown as Awaited<
			ReturnType<VendureBlogService['list']>
		>
	}

	async getOne(_id: string): ReturnType<VendureBlogService['getOne']> {
		return {} as unknown as Awaited<ReturnType<VendureBlogService['getOne']>>
	}
}

export const blogService = new BlogService()

// Wishlist and coupons are Litekart-backed features with no Vendure equivalent; serve empty
// state so the PDP, wishlist page and coupon drawer degrade cleanly instead of erroring.
export class WishlistService extends VendureWishlistService {
	async fetchWishlist(
		_options: Parameters<VendureWishlistService['fetchWishlist']>[0]
	): ReturnType<VendureWishlistService['fetchWishlist']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<VendureWishlistService['fetchWishlist']>>
	}

	async checkWishlist(
		_options: Parameters<VendureWishlistService['checkWishlist']>[0]
	): ReturnType<VendureWishlistService['checkWishlist']> {
		return false as unknown as Awaited<ReturnType<VendureWishlistService['checkWishlist']>>
	}

	async checkWishlistInBulk(
		_options: Parameters<VendureWishlistService['checkWishlistInBulk']>[0]
	): ReturnType<VendureWishlistService['checkWishlistInBulk']> {
		return [] as unknown as Awaited<ReturnType<VendureWishlistService['checkWishlistInBulk']>>
	}

	async toggleWishlist(
		_options: Parameters<VendureWishlistService['toggleWishlist']>[0]
	): ReturnType<VendureWishlistService['toggleWishlist']> {
		throw new Error('Wishlist is not available on this store')
	}
}

export const wishlistService = new WishlistService()

export class CouponService extends VendureCouponService {
	async listCoupons(
		_options: Parameters<VendureCouponService['listCoupons']>[0]
	): ReturnType<VendureCouponService['listCoupons']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<VendureCouponService['listCoupons']>>
	}
}

export const couponService = new CouponService()

// The connector points payment icons at `/static/payment/<code>`, which only a Litekart API serves.
// Repoint them at the copies this storefront ships — see payment-icons.ts.
export class PaymentMethodService extends VendurePaymentMethodService {
	async list(params: Parameters<VendurePaymentMethodService['list']>[0]): ReturnType<VendurePaymentMethodService['list']> {
		return withLocalPaymentIcons(await super.list(params)) as Awaited<ReturnType<VendurePaymentMethodService['list']>>
	}
}

export const paymentMethodService = new PaymentMethodService()
