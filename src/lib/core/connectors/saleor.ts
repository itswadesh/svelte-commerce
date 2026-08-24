import {
	BaseService as SaleorBaseService,
	AuthService as SaleorAuthService,
	BlogService as SaleorBlogService,
	CategoryService as SaleorCategoryService,
	PageService as SaleorPageService,
	CouponService as SaleorCouponService,
	WishlistService as SaleorWishlistService,
	MeilisearchService as SaleorMeilisearchService,
	MenuService as SaleorMenuService,
	ProfileService as SaleorProfileService,
	StoreService as SaleorStoreService,
	UserService as SaleorUserService
} from '@misiki/saleor-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// Saleor-only connector: like the vendure connector, @misiki/saleor-connector still calls Litekart
// REST endpoints (`/api/stores/public-details`, `/api/menu`, `/api/ms-autocomplete/*`,
// `/api/users/me`) for store/menu/profile data. Without a Litekart API those calls fail, and the
// store lookup failure is fatal (hooks + root layout). This module is what `kitcommerce.config.ts`
// exposes as `services` in Saleor mode: everything from the saleor connector, with the
// Litekart-REST-dependent services replaced by static data (default-store.json +
// kitcommerce.config.ts overrides) or delegated to Saleor-native calls. Its PageService already
// serves static dummy pages, so it needs no override.
export * from '@misiki/saleor-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_SALEOR_* env.
export const connectorName = 'saleor'

// Nothing in Saleor mode may fall through to a Litekart REST path: that API is not installed and
// not running. Reads return empty, writes fail loudly, and each unimplemented path is reported
// once — see rest-guard.ts.
// Local data first — menus, countries, currencies, plugin toggles — then the guard.
serveRestLocally(localStoreData)
blockRestFallbacks(SaleorBaseService, 'saleor')

// Store identity overrides (name, logo, currency, menus, plugins…) belong in
// kitcommerce.config.ts's default export — see staticStoreConfig.
export class StoreService extends SaleorStoreService {
	async getStoreByIdOrDomain(
		_params: Parameters<SaleorStoreService['getStoreByIdOrDomain']>[0]
	): ReturnType<SaleorStoreService['getStoreByIdOrDomain']> {
		return (await staticStoreConfig()) as unknown as Awaited<ReturnType<SaleorStoreService['getStoreByIdOrDomain']>>
	}
}

export const storeService = new StoreService()

// The connector's PageService serves static dummy pages but throws for ids it doesn't have
// (e.g. 'home', requested by the homepage load on every visit) — resolve those to empty instead.
export class PageService extends SaleorPageService {
	async getOne(id: string): ReturnType<SaleorPageService['getOne']> {
		try {
			return await super.getOne(id)
		} catch {
			return {} as unknown as Awaited<ReturnType<SaleorPageService['getOne']>>
		}
	}
}

export const pageService = new PageService()

// The nav (use-nav composable) reads `response.data` and filters on `menuId === 'header'`; serve
// the static store config's menus instead of the Litekart-only `/api/menu`.
export class MenuService extends SaleorMenuService {
	async list(): ReturnType<SaleorMenuService['list']> {
		const store = await staticStoreConfig()
		return { data: store.menu } as unknown as Awaited<ReturnType<SaleorMenuService['list']>>
	}
}

export const menuService = new MenuService()

// `/api/ms-autocomplete/*` is the Litekart API's Meilisearch proxy; serve empty suggestions
// (the search renderer reads `res.data`).
export class MeilisearchService extends SaleorMeilisearchService {
	async searchAutoComplete(
		_params: Parameters<SaleorMeilisearchService['searchAutoComplete']>[0]
	): ReturnType<SaleorMeilisearchService['searchAutoComplete']> {
		return { data: [] } as unknown as Awaited<ReturnType<SaleorMeilisearchService['searchAutoComplete']>>
	}
}

export const meilisearchService = new MeilisearchService()

// The profile page (use-my-profile) calls ProfileService, whose stock implementation is the
// Litekart-only `/api/users/*`. Delegate to the connector's Saleor-native equivalents
// (UserService.getMe via GraphQL `me`, AuthService.updateProfile via `accountUpdate`).
export class ProfileService extends SaleorProfileService {
	async getOne(): ReturnType<SaleorProfileService['getOne']> {
		return new SaleorUserService(this.getFetch()).getMe() as ReturnType<SaleorProfileService['getOne']>
	}

	async save(profile: Parameters<SaleorProfileService['save']>[0]): ReturnType<SaleorProfileService['save']> {
		// updateProfile's param type requires an `id` its implementation never reads; the profile
		// shape coming from getMe has none, so satisfy the type with a blank one.
		return new SaleorAuthService(this.getFetch()).updateProfile({
			id: '',
			...profile
		} as Parameters<SaleorAuthService['updateProfile']>[0]) as ReturnType<SaleorProfileService['save']>
	}
}

export const profileService = new ProfileService()

// Blogs are Litekart CMS content with no Saleor equivalent; the blog routes already render an
// empty state for `{ data: [] }`.
export class BlogService extends SaleorBlogService {
	async list(_options: Parameters<SaleorBlogService['list']>[0]): ReturnType<SaleorBlogService['list']> {
		return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 } as unknown as Awaited<
			ReturnType<SaleorBlogService['list']>
		>
	}

	async getOne(_id: string): ReturnType<SaleorBlogService['getOne']> {
		return {} as unknown as Awaited<ReturnType<SaleorBlogService['getOne']>>
	}
}

export const blogService = new BlogService()

// Wishlist and coupons are Litekart-backed features with no Saleor equivalent; serve empty
// state so the PDP, wishlist page and coupon drawer degrade cleanly instead of erroring.
export class WishlistService extends SaleorWishlistService {
	async fetchWishlist(
		_options: Parameters<SaleorWishlistService['fetchWishlist']>[0]
	): ReturnType<SaleorWishlistService['fetchWishlist']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<SaleorWishlistService['fetchWishlist']>>
	}

	async checkWishlist(
		_options: Parameters<SaleorWishlistService['checkWishlist']>[0]
	): ReturnType<SaleorWishlistService['checkWishlist']> {
		return false as unknown as Awaited<ReturnType<SaleorWishlistService['checkWishlist']>>
	}

	async checkWishlistInBulk(
		_options: Parameters<SaleorWishlistService['checkWishlistInBulk']>[0]
	): ReturnType<SaleorWishlistService['checkWishlistInBulk']> {
		return [] as unknown as Awaited<ReturnType<SaleorWishlistService['checkWishlistInBulk']>>
	}

	async toggleWishlist(
		_options: Parameters<SaleorWishlistService['toggleWishlist']>[0]
	): ReturnType<SaleorWishlistService['toggleWishlist']> {
		throw new Error('Wishlist is not available on this store')
	}
}

export const wishlistService = new WishlistService()

export class CouponService extends SaleorCouponService {
	async listCoupons(
		_options: Parameters<SaleorCouponService['listCoupons']>[0]
	): ReturnType<SaleorCouponService['listCoupons']> {
		return { data: [], count: 0 } as unknown as Awaited<ReturnType<SaleorCouponService['listCoupons']>>
	}
}

export const couponService = new CouponService()

// `use-category-filters` in @misiki/kitcommerce-core fetches the category tree by raw Litekart REST
// path rather than a typed method — `categoryService.get('/api/categories/all')`. With no Litekart
// API behind Saleor that URL stays relative, so Vite proxies it to
// PUBLIC_LITEKART_API_URL || localhost:7000 and dev logs
// `http proxy error: api/categories/all ... ECONNREFUSED` (nothing renders the category tree).
// Route that one path to the connector's own Saleor-native category query; `fetchAllCategories`
// already returns the `{ data }` shape the composable reads. Any other URL falls through
// unchanged, so services that legitimately call `get()` are untouched.
export class CategoryService extends SaleorCategoryService {
	async get<T>(url: string): Promise<T> {
		if (typeof url === 'string' && url.startsWith('/api/categories/all')) {
			return (await this.fetchAllCategories()) as T
		}
		return super.get<T>(url)
	}
}

export const categoryService = new CategoryService()
