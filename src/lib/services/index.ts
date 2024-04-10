// export * from './bigcommerce'

import * as Shopify from './shopify'

export function getSelectedService(serviceName: string) {
	switch (serviceName) {
		case 'SHOPIFY':
			return Shopify
		default:
			throw new Error(`Invalid service name: ${serviceName}`)
	}
}

//custom shopify services
const selectedServiceName = 'SHOPIFY'
const selectedService = getSelectedService(selectedServiceName)




import { services } from '@misiki/litekart-utils'
export const {
	AddressService,
	AutocompleteService,
	BannersService,
	BlogService,
	// BrandService,
	CartService,
	CategoryService,
	// ChatService,
	CollectionService,
	ContactService,
	CountryService,
	CouponService,
	DealsService,
	DemoRequestService,
	// DiscountService,
	FaqService,
	// FeedbackService,
	GalleryService,
	// HokodoService,
	HomeService,
	InitService,
	// InvoiceService,
	// MenuService,
	OrdersService,
	PageService,
	PaymentMethodService,
	// PopularityService,
	PopularSearchService,
	ProductService,
	// ReelService,
	// ReturnService,
	ReviewService,
	StoreService,
	UserService,
	VendorService,
	WishlistService,
	ZipService
} = selectedService

// export * from './medusa'
export * from './shopify'
// export * from './woocommerce'

// // services.js
// import { env } from '$env/dynamic/public'
// import * as Litekart from './litekart'
// import * as Shopify from './shopify'
// // import * as Woocommerce from './woocommerce'
// // import * as MedusaJs from './medusa'
// // import * as BigCommerce from './bigcommerce'

// export function getSelectedService(serviceName: string) {
// 	switch (serviceName) {
// 		case 'SHOPIFY':
// 			return Shopify
// 		default:
// 			throw new Error(`Invalid service name: ${serviceName}`)
// 	}
// }

// //custom shopify services

// const selectedServiceName = 'SHOPIFY'

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
