// const provider = 'Litekart'
// const dirPath = `./${provider}`
// const moduleNames = ['AddressService', 'ZipService', 'AutocompleteService']
import { provider } from '$lib/config'
let AddressService,
	BannersService,
	BlogService,
	AutocompleteService,
	CartService,
	CategoryService,
	ContactService,
	CountryService,
	CouponService,
	DealsService,
	DemoRequestService,
	FaqService,
	HomeService,
	OrdersService,
	PaymentMethodService,
	PopularSearchService,
	ProductService,
	ReviewService,
	StoreService,
	UserService,
	VerndorService,
	WishlistService,
	ZipService
;(async () => {
	AddressService = await import(`./${provider}/AddressService.ts`)

	BannersService = await import(`./${provider}/BannersService.ts`)

	BlogService = await import(`./${provider}/BlogService.ts`)

	AutocompleteService = await import(`./${provider}/AutocompleteService.ts`)

	CartService = await import(`./${provider}/CartService.ts`)

	CategoryService = await import(`./${provider}/CategoryService.ts`)

	ContactService = await import(`./${provider}/ContactService.ts`)

	CountryService = await import(`./${provider}/CountryService.ts`)

	CouponService = await import(`./${provider}/CouponService.ts`)

	DealsService = await import(`./${provider}/DealsService.ts`)

	DemoRequestService = await import(`./${provider}/DemoRequestService.ts`)

	FaqService = await import(`./${provider}/FaqService.ts`)

	HomeService = await import(`./${provider}/HomeService.ts`)

	OrdersService = await import(`./${provider}/OrdersService.ts`)

	PaymentMethodService = await import(`./${provider}/PaymentMethodService.ts`)

	PopularSearchService = await import(`./${provider}/PopularSearchService.ts`)

	ProductService = await import(`./${provider}/ProductService.ts`)

	ReviewService = await import(`./${provider}/ReviewService.ts`)

	StoreService = await import(`./${provider}/StoreService.ts`)

	UserService = await import(`./${provider}/UserService.ts`)

	VerndorService = await import(`./${provider}/VerndorService.ts`)

	WishlistService = await import(`./${provider}/WishlistService.ts`)

	ZipService = await import(`./${provider}/ZipService.ts`)
})()

export {
	AddressService,
	BannersService,
	BlogService,
	AutocompleteService,
	CartService,
	CategoryService,
	ContactService,
	CountryService,
	CouponService,
	DealsService,
	DemoRequestService,
	FaqService,
	HomeService,
	OrdersService,
	PaymentMethodService,
	PopularSearchService,
	ProductService,
	ReviewService,
	StoreService,
	UserService,
	VerndorService,
	WishlistService,
	ZipService
}
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
