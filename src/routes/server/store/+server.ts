import { InitService } from '$lib/services'

export async function GET({ cookies, request, locals }) {
	let storeOne, settings, popularSearches, megamenu, store
	try {
		const uri = new URL(request.url)

		const storeRes = await InitService.fetchInit(uri.host)

		storeOne = storeRes.storeOne
		settings = storeRes.settings
		popularSearches = storeRes.popularSearches
		megamenu = storeRes.megamenu
		store = {
			id: storeRes.storeOne._id,
			address: storeRes.storeOne.address,
			adminUrl: storeRes.storeOne.adminUrl || storeRes.settings.adminUrl, // storeRes.storeOne.adminUrl used for arialmall
			alert: storeRes.storeOne.alert,
			close: storeRes.storeOne.close,
			currencyCode: storeRes.storeOne.storeCurrency?.isoCode || 'USD',
			currencySymbol: storeRes.storeOne.storeCurrency?.symbol || '$',
			description: storeRes.storeOne.description,
			dimentionUnit: storeRes.storeOne.dimentionUnit,
			domain: storeRes.storeOne.domain,
			DOMAIN: storeRes.storeOne.DOMAIN,
			email: storeRes.storeOne.websiteEmail,
			facebookPixel: { active: storeRes.storeOne?.facebookPixel?.active?.val, id: storeRes.storeOne?.facebookPixel?.id?.val || '' },
			favicon: storeRes.storeOne.favicon,
			GOOGLE_ANALYTICS_ID: storeRes.storeOne.GOOGLE_ANALYTICS_ID,
			GOOGLE_CLIENT_ID: storeRes.storeOne.GOOGLE_CLIENT_ID,
			googleAnalytics: { active: storeRes.storeOne?.googleAnalytics?.active?.val, id: storeRes.storeOne?.googleAnalytics?.id?.val || '' },
			guaranteed_response_time: storeRes.storeOne.guaranteed_response_time,
			hellobar: storeRes.storeOne.hellobar,
			homePageSliderBannerImageHeight: storeRes.storeOne.homePageSliderBannerImageHeight,
			IMAGE_CDN_URL: storeRes.storeOne.IMAGE_CDN_URL,
			isBulkOrder: storeRes.storeOne.isBulkOrder,
			isDeals: storeRes.storeOne.isDeals,
			isDiscountCoupons: storeRes.storeOne.isDiscountCoupons,
			isFnb: storeRes.storeOne.isFnb,
			isGDPR: storeRes.storeOne.isGDPR,
			isHyperlocal: storeRes.storeOne.isHyperlocal,
			isIndianPincodes: storeRes.storeOne.isIndianPincodes,
			isMultiVendor: storeRes.storeOne.isMultiVendor,
			isProductReviewsAndRatings: storeRes.storeOne.isProductReviewsAndRatings,
			isSecureCatalogue: storeRes.storeOne.isSecureCatalogue,
			isWishlist: storeRes.storeOne.isWishlist,
			keywords: storeRes.storeOne.keywords,
			loginUrl: '/auth/login',
			logo: storeRes.storeOne.logo,
			otpLogin: storeRes.storeOne.otpLogin || true,
			phone: storeRes.storeOne.phone,
			product_image_dimension: storeRes.storeOne.product_image_dimension,
			searchbarText: storeRes.storeOne.searchbarText,
			socialSharingButtons: storeRes.storeOne.socialSharingButtons,
			store_timings: storeRes.storeOne.store_timings,
			storePromoVideo: storeRes.storeOne.storePromoVideo,
			title: storeRes.storeOne.title,
			websiteLegalName: storeRes.storeOne.websiteLegalName,
			websiteName: storeRes.storeOne.websiteName,
			weightUnit: storeRes.storeOne.weightUnit,
			whatsappChatButton: storeRes.storeOne.whatsappChatButton

		}
		cookies.set('store', JSON.stringify(store), { path: '/' })
		locals.store = store
	} catch (e) { }

	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
