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
			closed: storeRes.storeOne.closed,
			closedMessage: storeRes.storeOne.closedMessage,
			currencyCode: storeRes.storeOne.storeCurrency?.isoCode || 'USD',
			currencySymbol: storeRes.storeOne.storeCurrency?.symbol || '$',
			description: storeRes.storeOne.description,
			dimentionUnit: storeRes.storeOne.dimentionUnit,
			domain: storeRes.storeOne.domain,
			DOMAIN: storeRes.storeOne.DOMAIN,
			email: storeRes.storeOne.websiteEmail,
			GOOGLE_ANALYTICS_ID: storeRes.storeOne.GOOGLE_ANALYTICS_ID,
			GOOGLE_CLIENT_ID: storeRes.storeOne.GOOGLE_CLIENT_ID,
			hellobar: storeRes.storeOne.hellobar,
			IMAGE_CDN_URL: storeRes.storeOne.IMAGE_CDN_URL,
			isDeals: storeRes.storeOne.isDeals,
			isDiscountCoupons: storeRes.storeOne.isDiscountCoupons,
			isFnb: storeRes.storeOne.isFnb,
			isGDPR: storeRes.storeOne.isGDPR,
			isProductReviewsAndRatings: storeRes.storeOne.isProductReviewsAndRatings,
			isSecureCatalogue: storeRes.storeOne.isSecureCatalogue,
			isWhatsappChatButton: storeRes.storeOne.isWhatsappChatButton,
			isWishlist: storeRes.storeOne.isWishlist,
			keywords: storeRes.storeOne.keywords,
			loginUrl: storeRes.storeOne.otpLogin ? '/auth/otp-login' : '/auth/login',
			logo: storeRes.storeOne.logo,
			otpLogin: storeRes.storeOne.otpLogin || true,
			phone: storeRes.storeOne.phone,
			searchbarText: storeRes.storeOne.searchbarText,
			socialSharingButtons: storeRes.storeOne.socialSharingButtons,
			title: storeRes.storeOne.title,
			websiteLegalName: storeRes.storeOne.websiteLegalName,
			websiteName: storeRes.storeOne.websiteName,
			weightUnit: storeRes.storeOne.weightUnit,

		}
		cookies.set('store', JSON.stringify(store), { path: '/' })
		locals.store = store
	} catch (e) { }

	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
