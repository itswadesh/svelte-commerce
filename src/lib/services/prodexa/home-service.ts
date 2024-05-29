export const fetchHome = async ({ origin, storeId, pageId = 'home', server = false, sid = null }: any) => ({
	page: {
		name: 'Home',
		// sliderBanners: {
		// 	title: '',
		// 	isScroll: false,
		// 	cols: 3,
		// 	banners: [
		// ...
		// 	]
		// },
		// heroBanners: {
		// 	title: '',
		// 	isScroll: false,
		// 	cols: 3,
		// 	banners: [
		// ...
		// 	]
		// },
		store: 'prodexa',
		active: true,
		// pickedBanners: [
		// 	{
		// 		title: 'Jewellary Corner',
		// 		isScroll: false,
		// 		cols: 3,
		// 		banners: [
		// ...
		// 		],
		// 		_id: '64f754447b63e9599d66a962'
		// 	},
		// 	{
		// 		title: 'Fashion Corner',
		// 		isScroll: false,
		// 		cols: 3,
		// 		banners: [
		// ...
		// 		],
		// 		_id: '64f7554f7b63e9599d66a9e8'
		// 	},
		// 	{
		// 		title: 'Furniture Corner',
		// 		isScroll: false,
		// 		cols: 3,
		// 		banners: [
		// ...
		// 		],
		// 		_id: '64f755ceab313ebe612e8d7f'
		// 	}
		// ],
		slug: 'home',
		keywords: '',
		metaDescription: '',
		title: '',
		banners: []
	},
	brands: null,
	categories: null,
	html: null,
	trending: null,
	youMayLike: null
})

export declare const fetchCategoriesProducts: ({ categories, origin, sid, storeId }: {
	categories: any;
	origin: any;
	sid?: any;
	storeId: any;
}) => Promise<any>
