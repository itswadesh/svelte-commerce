import {
	AuthService as MedusaAuthService,
	BlogService as MedusaBlogService,
	CouponService as MedusaCouponService,
	WishlistService as MedusaWishlistService,
	MeilisearchService as MedusaMeilisearchService,
	MenuService as MedusaMenuService,
	PageService as MedusaPageService,
	ProfileService as MedusaProfileService,
	StoreService as MedusaStoreService,
	UserService as MedusaUserService
} from '@misiki/medusa-connector'
import { staticStoreConfig } from './static-store'

// Medusa-only connector: like the vendure connector, @misiki/medusa-connector still calls Litekart
// REST endpoints (`/api/stores/public-details`, `/api/pages/*`, `/api/menu`,
// `/api/ms-autocomplete/*`, `/api/users/me`) for store/page/menu/profile data. Without a Litekart
// API those calls fail, and the store lookup failure is fatal (hooks + root layout). This module
// is what `kitcommerce.config.ts` exposes as `services` in Medusa mode: everything from the
// medusa connector, with the Litekart-REST-dependent services replaced by static data
// (default-store.json + kitcommerce.config.ts overrides) or delegated to Medusa-native calls.
export * from '@misiki/medusa-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_MEDUSA_* env.
export const connectorName = 'medusa'

// Store identity overrides (name, logo, currency, menus, plugins…) belong in
// kitcommerce.config.ts's default export — see staticStoreConfig.
export class StoreService extends MedusaStoreService {
	async getStoreByIdOrDomain(
		_params: Parameters<MedusaStoreService['getStoreByIdOrDomain']>[0]
	): ReturnType<MedusaStoreService['getStoreByIdOrDomain']> {
		return (await staticStoreConfig()) as unknown as Awaited<ReturnType<MedusaStoreService['getStoreByIdOrDomain']>>
	}
}

export const storeService = new StoreService()

// Pages are Litekart CMS content with no Medusa equivalent. Loads that use these already render
// empty states for `{}`/`[]`; resolving statically keeps home/legal pages off the dead REST path.
export class PageService extends MedusaPageService {
	async list(_options: Parameters<MedusaPageService['list']>[0]): ReturnType<MedusaPageService['list']> {
		return [] as unknown as Awaited<ReturnType<MedusaPageService['list']>>
	}

	async listLatestPages(
		_options: Parameters<MedusaPageService['listLatestPages']>[0]
	): ReturnType<MedusaPageService['listLatestPages']> {
		return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 } as unknown as Awaited<
			ReturnType<MedusaPageService['listLatestPages']>
		>
	}

	async getOne(_id: string): ReturnType<MedusaPageService['getOne']> {
		return {} as unknown as Awaited<ReturnType<MedusaPageService['getOne']>>
	}
}

export const pageService = new PageService()

// The nav (use-nav composable) reads `response.data` and filters on `menuId === 'header'`; serve
// the static store config's menus instead of the Litekart-only `/api/menu`.
export class MenuService extends MedusaMenuService {
	async list(): ReturnType<MedusaMenuService['list']> {
		const store = await staticStoreConfig()
		return { data: store.menu } as unknown as Awaited<ReturnType<MedusaMenuService['list']>>
	}
}

export const menuService = new MenuService()

// `/api/ms-autocomplete/*` is the Litekart API's Meilisearch proxy; serve empty suggestions
// (the search renderer reads `res.data`).
export class MeilisearchService extends MedusaMeilisearchService {
	async searchAutoComplete(
		_params: Parameters<MedusaMeilisearchService['searchAutoComplete']>[0]
	): ReturnType<MedusaMeilisearchService['searchAutoComplete']> {
		return { data: [] } as unknown as Awaited<ReturnType<MedusaMeilisearchService['searchAutoComplete']>>
	}
}

export const meilisearchService = new MeilisearchService()

// The profile page (use-my-profile) calls ProfileService, whose stock implementation is the
// Litekart-only `/api/users/*`. Delegate to the connector's Medusa-native equivalents
// (UserService.getMe via the Medusa SDK, AuthService.updateProfile).
export class ProfileService extends MedusaProfileService {
	async getOne(): ReturnType<MedusaProfileService['getOne']> {
		return new MedusaUserService(this.getFetch()).getMe() as ReturnType<MedusaProfileService['getOne']>
	}

	async save(profile: Parameters<MedusaProfileService['save']>[0]): ReturnType<MedusaProfileService['save']> {
		// updateProfile's param type requires an `id` its implementation never reads; the profile
		// shape coming from getMe has none, so satisfy the type with a blank one.
		return new MedusaAuthService(this.getFetch()).updateProfile({
			id: '',
			...profile
		} as Parameters<MedusaAuthService['updateProfile']>[0]) as ReturnType<MedusaProfileService['save']>
	}
}

export const profileService = new ProfileService()

// Blogs are Litekart CMS content with no Medusa equivalent; the blog routes already render an
// empty state for `{ data: [] }`.
export class BlogService extends MedusaBlogService {
	async list(_options: Parameters<MedusaBlogService['list']>[0]): ReturnType<MedusaBlogService['list']> {
		return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 } as unknown as Awaited<
			ReturnType<MedusaBlogService['list']>
		>
	}

	async getOne(_id: string): ReturnType<MedusaBlogService['getOne']> {
		return {} as unknown as Awaited<ReturnType<MedusaBlogService['getOne']>>
	}
}

export const blogService = new BlogService()

// Wishlist and coupons are Litekart-backed features with no Medusa equivalent; serve empty
// state so the PDP, wishlist page and coupon drawer degrade cleanly instead of erroring.
export class WishlistService extends MedusaWishlistService {
	async fetchWishlist(
		_options: Parameters<MedusaWishlistService['fetchWishlist']>[0]
	): ReturnType<MedusaWishlistService['fetchWishlist']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<MedusaWishlistService['fetchWishlist']>>
	}

	async checkWishlist(
		_options: Parameters<MedusaWishlistService['checkWishlist']>[0]
	): ReturnType<MedusaWishlistService['checkWishlist']> {
		return false as unknown as Awaited<ReturnType<MedusaWishlistService['checkWishlist']>>
	}

	async checkWishlistInBulk(
		_options: Parameters<MedusaWishlistService['checkWishlistInBulk']>[0]
	): ReturnType<MedusaWishlistService['checkWishlistInBulk']> {
		return [] as unknown as Awaited<ReturnType<MedusaWishlistService['checkWishlistInBulk']>>
	}

	async toggleWishlist(
		_options: Parameters<MedusaWishlistService['toggleWishlist']>[0]
	): ReturnType<MedusaWishlistService['toggleWishlist']> {
		throw new Error('Wishlist is not available on this store')
	}
}

export const wishlistService = new WishlistService()

export class CouponService extends MedusaCouponService {
	async listCoupons(
		_options: Parameters<MedusaCouponService['listCoupons']>[0]
	): ReturnType<MedusaCouponService['listCoupons']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<MedusaCouponService['listCoupons']>>
	}
}

export const couponService = new CouponService()
