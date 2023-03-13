// const provider = 'Litekart'
// const dirPath = `./${provider}`
// const moduleNames = ['AddressService', 'ZipService', 'AutocompleteService']
import { provider } from '$lib/config'

export const AddressService =
	(provider === 'Litekart' && (await import('./Litekart/AddressService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/AddressService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/AddressService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/AddressService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/AddressService')))

export const BannersService =
	(provider === 'Litekart' && (await import('./Litekart/BannersService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/BannersService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/BannersService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/BannersService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/BannersService')))

export const BlogService =
	(provider === 'Litekart' && (await import('./Litekart/BlogService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/BlogService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/BlogService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/BlogService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/BlogService')))

export const AutocompleteService =
	(provider === 'Litekart' && (await import('./Litekart/AutocompleteService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/AutocompleteService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/AutocompleteService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/AutocompleteService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/AutocompleteService')))

export const CartService =
	(provider === 'Litekart' && (await import('./Litekart/CartService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/CartService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CartService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CartService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CartService')))

export const CategoryService =
	(provider === 'Litekart' && (await import('./Litekart/CategoryService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/CategoryService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CategoryService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CategoryService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CategoryService')))

export const ContactService =
	(provider === 'Litekart' && (await import('./Litekart/ContactService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/ContactService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ContactService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ContactService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ContactService')))

export const CountryService =
	(provider === 'Litekart' && (await import('./Litekart/CountryService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/CountryService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CountryService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CountryService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CountryService')))

export const CouponService =
	(provider === 'Litekart' && (await import('./Litekart/CouponService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/CouponService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CouponService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CouponService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CouponService')))

export const DealsService =
	(provider === 'Litekart' && (await import('./Litekart/DealsService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/DealsService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/DealsService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/DealsService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/DealsService')))

export const DemoRequestService =
	(provider === 'Litekart' && (await import('./Litekart/DemoRequestService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/DemoRequestService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/DemoRequestService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/DemoRequestService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/DemoRequestService')))

export const FaqService =
	(provider === 'Litekart' && (await import('./Litekart/FaqService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/FaqService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/FaqService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/FaqService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/FaqService')))

export const HomeService =
	(provider === 'Litekart' && (await import('./Litekart/HomeService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/HomeService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/HomeService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/HomeService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/HomeService')))

export const OrdersService =
	(provider === 'Litekart' && (await import('./Litekart/OrdersService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/OrdersService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/OrdersService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/OrdersService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/OrdersService')))

export const PaymentMethodService =
	(provider === 'Litekart' && (await import('./Litekart/PaymentMethodService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/PaymentMethodService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/PaymentMethodService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/PaymentMethodService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/PaymentMethodService')))

export const PopularSearchService =
	(provider === 'Litekart' && (await import('./Litekart/PopularSearchService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/PopularSearchService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/PopularSearchService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/PopularSearchService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/PopularSearchService')))

export const ProductService =
	(provider === 'Litekart' && (await import('./Litekart/ProductService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/ProductService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ProductService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ProductService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ProductService')))

export const ReviewService =
	(provider === 'Litekart' && (await import('./Litekart/ReviewService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/ReviewService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ReviewService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ReviewService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ReviewService')))

export const StoreService = provider === 'Litekart' && (await import('./Litekart/StoreService'))

export const UserService =
	(provider === 'Litekart' && (await import('./Litekart/UserService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/UserService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/UserService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/UserService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/UserService')))

export const VerndorService =
	(provider === 'Litekart' && (await import('./Litekart/VerndorService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/VerndorService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/VerndorService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/VerndorService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/VerndorService')))

export const WishlistService =
	(provider === 'Litekart' && (await import('./Litekart/WishlistService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/WishlistService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/WishlistService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/WishlistService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/WishlistService')))

export const ZipService =
	(provider === 'Litekart' && (await import('./Litekart/ZipService'))) ||
	(provider === 'BigCommerce' && (await import('./BigCommerce/ZipService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ZipService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ZipService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ZipService')))

// async function importModules() {
// 	const modules = await Promise.all(
// 		moduleNames.map(async (moduleName) => {
//             if(provider === 'Litekart')
// 			console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', `${dirPath}/${moduleName}.ts`)
// 			const { default: module } = await import(`${dirPath}/${moduleName}.ts`)
// 			console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', JSON.stringify(module))
// 			return module
// 		})
// 	)
// 	return Object.fromEntries(moduleNames.map((name, i) => [name, modules[i]]))
// }

// export default importModules
