// const provider = 'Litekart'
// const dirPath = `./${provider}`
// const moduleNames = ['AddressService', 'ZipService', 'AutocompleteService']
import { provider } from '$lib/config'

export const AddressService =
	(provider === 'Litekart' && (await import('./Litekart/AddressService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/AddressService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/AddressService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/AddressService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/AddressService')))

export const BannersService =
	(provider === 'Litekart' && (await import('./Litekart/BannersService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/BannersService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/BannersService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/BannersService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/BannersService')))

export const BlogService =
	(provider === 'Litekart' && (await import('./Litekart/BlogService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/BlogService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/BlogService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/BlogService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/BlogService')))

export const AutocompleteService =
	(provider === 'Litekart' && (await import('./Litekart/AutocompleteService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/AutocompleteService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/AutocompleteService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/AutocompleteService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/AutocompleteService')))

export const CartService =
	(provider === 'Litekart' && (await import('./Litekart/CartService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/CartService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CartService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CartService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CartService')))

export const CategoryService =
	(provider === 'Litekart' && (await import('./Litekart/CategoryService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/CategoryService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CategoryService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CategoryService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CategoryService')))

export const ContactService =
	(provider === 'Litekart' && (await import('./Litekart/ContactService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/ContactService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ContactService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ContactService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ContactService')))

export const CountryService =
	(provider === 'Litekart' && (await import('./Litekart/CountryService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/CountryService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CountryService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CountryService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CountryService')))

export const CouponService =
	(provider === 'Litekart' && (await import('./Litekart/CouponService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/CouponService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/CouponService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/CouponService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/CouponService')))

export const DealsService =
	(provider === 'Litekart' && (await import('./Litekart/DealsService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/DealsService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/DealsService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/DealsService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/DealsService')))

export const DemoRequestService =
	(provider === 'Litekart' && (await import('./Litekart/DemoRequestService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/DemoRequestService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/DemoRequestService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/DemoRequestService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/DemoRequestService')))

export const FaqService =
	(provider === 'Litekart' && (await import('./Litekart/FaqService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/FaqService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/FaqService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/FaqService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/FaqService')))

export const HomeService =
	(provider === 'Litekart' && (await import('./Litekart/HomeService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/HomeService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/HomeService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/HomeService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/HomeService')))

export const OrdersService =
	(provider === 'Litekart' && (await import('./Litekart/OrdersService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/OrdersService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/OrdersService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/OrdersService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/OrdersService')))

export const PaymentMethodService =
	(provider === 'Litekart' && (await import('./Litekart/PaymentMethodService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/PaymentMethodService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/PaymentMethodService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/PaymentMethodService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/PaymentMethodService')))

export const PopularSearchService =
	(provider === 'Litekart' && (await import('./Litekart/PopularSearchService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/PopularSearchService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/PopularSearchService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/PopularSearchService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/PopularSearchService')))

export const ProductService =
	(provider === 'Litekart' && (await import('./Litekart/ProductService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/ProductService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ProductService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ProductService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ProductService')))

export const ReviewService =
	(provider === 'Litekart' && (await import('./Litekart/ReviewService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/ReviewService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/ReviewService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/ReviewService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/ReviewService')))

export const StoreService = provider === 'Litekart' && (await import('./Litekart/StoreService'))

export const UserService =
	(provider === 'Litekart' && (await import('./Litekart/UserService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/UserService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/UserService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/UserService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/UserService')))

export const VerndorService =
	(provider === 'Litekart' && (await import('./Litekart/VerndorService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/VerndorService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/VerndorService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/VerndorService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/VerndorService')))

export const WishlistService =
	(provider === 'Litekart' && (await import('./Litekart/WishlistService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/WishlistService'))) ||
	(provider === 'Woocommerce' && (await import('./Woocommerce/WishlistService'))) ||
	(provider === 'Shopify' && (await import('./Shopify/WishlistService'))) ||
	(provider === 'Medusa' && (await import('./Medusa/WishlistService')))

export const ZipService =
	(provider === 'Litekart' && (await import('./Litekart/ZipService'))) ||
	(provider === 'Bigcommerce' && (await import('./Bigcommerce/ZipService'))) ||
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
