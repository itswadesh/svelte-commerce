// export * from './bigcommerce'
import { services } from '@misiki/litekart-utils'
export const {
	AddressService,
	AutocompleteService,
	BannersService,
	BlogService,
	CartService,
	CategoryService,
	CollectionService,
	ContactService,
	CountryService,
	CouponService,
	DealsService,
	DemoRequestService,
	FaqService,
	GalleryService,
	HomeService,
	InitService,
	OrdersService,
	PageService,
	PaymentMethodService,
	PopularSearchService,
	ProductService,
	ReviewService,
	StoreService,
	UserService,
	VendorService,
	WishlistService,
	ZipService
} = services

// export * from './medusa'
// export * from './shopify'
// export * from './woocommerce'

// // services.js
// import { env } from '$env/dynamic/public'
// import * as Litekart from './litekart'
// import * as Shopify from './shopify'
// import * as Woocommerce from './woocommerce'
// import * as MedusaJs from './medusa'
// import * as BigCommerce from './bigcommerce'

// export function getSelectedService(serviceName: string) {
// 	switch (serviceName) {
// 		case 'LITEKART':
// 			return Litekart
// 		case 'SHOPIFY':
// 			return Shopify
// 		case 'WOOCOMERCE':
// 			return Woocommerce
// 		case 'MEDUSAJS':
// 			return MedusaJs
// 		case 'BIGCOMMERCE':
// 			return BigCommerce
// 		default:
// 			throw new Error(`Invalid service name: ${serviceName}`)
// 	}
// }

// const selectedServiceName = env.PUBLIC_SELECTED_SERVICE || 'LITEKART'

// const selectedService = getSelectedService(selectedServiceName)

// export const {
// 	AddressService,
// 	AutocompleteService,
// 	BannersService,
// 	BlogService,
// 	CartService,
// 	CategoryService,
// 	CollectionService,
// 	ContactService,
// 	CountryService,
// 	CouponService,
// 	DealsService,
// 	DemoRequestService,
// 	FaqService,
// 	GalleryService,
// 	HomeService,
// 	InitService,
// 	OrdersService,
// 	PageService,
// 	PaymentMethodService,
// 	PopularSearchService,
// 	ProductService,
// 	ReviewService,
// 	StoreService,
// 	UserService,
// 	VendorService,
// 	WishlistService,
// 	ZipService
// } = selectedService
