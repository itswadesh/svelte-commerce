import { json } from '@sveltejs/kit'
import { StoreService } from '$lib/services'

export async function GET({ cookies, request, locals, setHeaders }) {
	let menu, popularSearches, megamenu, store
	const host = locals.host
	try {
		// const uri = new URL(request.url)
		// const storeRes = await InitService.fetchInit({ host: uri.host, origin: uri.origin })
		const storeRes = await StoreService.getStoreData({
			url: request.url,
			host,
			cookies
		})

		store = storeRes.storeOne
		popularSearches = storeRes.popularSearches
		megamenu = storeRes.megamenu
		menu = storeRes.menu
		// store = {
		// 	id: storeOne?._id,
		// 	address: storeOne?.address,
		// 	adminUrl: storeOne?.adminUrl || storeRes.settings?.adminUrl, // storeOne?.adminUrl used for arialmall
		// 	alert: storeOne?.alert,
		// 	allowBackOrder: storeOne?.allowBackOrder,
		// 	close: storeOne?.close,
		// 	currencyCode: storeOne?.storeCurrency?.isoCode || 'USD',
		// 	currencySymbol: storeOne?.storeCurrency?.symbol || '$',
		// 	description: storeOne?.description,
		// 	dimentionUnit: storeOne?.dimentionUnit,
		// 	domain: storeOne?.domain,
		// 	DOMAIN: storeOne?.DOMAIN,
		// 	email: storeOne?.websiteEmail,
		// 	facebookPixel: {
		// 		active: storeOne?.facebookPixel?.active?.val,
		// 		id: storeOne?.facebookPixel?.id?.val || ''
		// 	},
		// 	favicon: storeOne?.favicon,
		// 	GOOGLE_ANALYTICS_ID: storeOne?.GOOGLE_ANALYTICS_ID,
		// 	GOOGLE_CLIENT_ID: storeOne?.GOOGLE_CLIENT_ID,
		// 	googleAnalytics: {
		// 		active: storeOne?.googleAnalytics?.active?.val,
		// 		id: storeOne?.googleAnalytics?.id?.val || ''
		// 	},
		// 	guaranteed_response_time: storeOne?.guaranteed_response_time,
		// 	hellobar: storeOne?.hellobar,
		// 	homePageSliderBannerImageHeight: storeOne?.homePageSliderBannerImageHeight,
		// 	IMAGE_CDN_URL: storeOne?.IMAGE_CDN_URL,
		// 	isBulkOrder: storeOne?.isBulkOrder,
		// 	isDeals: storeOne?.isDeals,
		// 	isDiscountCoupons: storeOne?.isDiscountCoupons,
		// 	isFnb: storeOne?.isFnb,
		// 	isGDPR: storeOne?.isGDPR,
		// 	isHyperlocal: storeOne?.isHyperlocal,
		// 	isIndianPincodes: storeOne?.isIndianPincodes,
		// 	isMultiVendor: storeOne?.isMultiVendor,
		// 	isProductReviewsAndRatings: storeOne?.isProductReviewsAndRatings,
		// 	isSecureCatalogue: storeOne?.isSecureCatalogue,
		// 	isWishlist: storeOne?.isWishlist,
		// 	keywords: storeOne?.keywords,
		// 	loginUrl: '/auth/login',
		// 	logo: storeOne?.logo,
		// 	otpLogin: storeOne?.otpLogin || true,
		// 	phone: storeOne?.phone,
		// 	product_image_dimension: storeOne?.product_image_dimension,
		// 	searchbarText: storeOne?.searchbarText,
		// 	socialSharingButtons: storeOne?.socialSharingButtons,
		// 	store_timings: storeOne?.store_timings,
		//  storeCountries: storeOne?.storeCountries,
		//  storeCountry: storeOne?.storeCountry,
		//  storeCurrencies: storeOne?.storeCurrencies,
		//  storeCurrency: storeOne?.storeCurrency,
		//  storeLanguage: storeOne?.storeLanguage,
		//  storeLanguages: storeOne?.storeLanguages,
		// 	storePromoVideo: storeOne?.storePromoVideo,
		// 	title: storeOne?.title,
		// 	websiteLegalName: storeOne?.websiteLegalName,
		// 	websiteName: storeOne?.websiteName,
		// 	weightUnit: storeOne?.weightUnit,
		// 	whatsappChatButton: storeOne?.whatsappChatButton
		// }
		// const storeId = storeOne?._id
		// cookies.set('storeId', storeId, { path: '/' })
		// locals.storeId = storeId
		setHeaders({ 'Cache-Control': 'max-age=60' })
	} catch (e) { }
	return json({ store, menu, popularSearches, megamenu })
}
