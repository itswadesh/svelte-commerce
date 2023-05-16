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
			facebookUrl: storeRes.storeOne.facebookUrl,
			GOOGLE_ANALYTICS_ID: storeRes.storeOne.GOOGLE_ANALYTICS_ID,
			GOOGLE_CLIENT_ID: storeRes.storeOne.GOOGLE_CLIENT_ID,
			instagramUrl: storeRes.storeOne.instagramUrl,
			isSecureCatalogue: storeRes.storeOne.isSecureCatalogue,
			isWishlist: storeRes.storeOne.isWishlist,
			isDeals: storeRes.storeOne.isDeals,
			isDiscountCoupons: storeRes.storeOne.isDiscountCoupons,
			isProductReviewsAndRatings: storeRes.storeOne.isProductReviewsAndRatings,
			isWhatsappChatButton: storeRes.storeOne.isWhatsappChatButton,
			isGDPR: storeRes.storeOne.isGDPR,
			isFnb: storeRes.storeOne.isFnb,
			hellobar: storeRes.storeOne.hellobar,
			keywords: storeRes.storeOne.keywords,
			linkedinUrl: storeRes.storeOne.linkedinUrl,
			loginUrl: storeRes.storeOne.otpLogin ? '/auth/otp-login' : '/auth/login',
			logo: storeRes.storeOne.logo,
			otpLogin: storeRes.storeOne.otpLogin || true,
			phone: storeRes.storeOne.phone,
			pinterestUrl: storeRes.storeOne.pinterestUrl,
			searchbarText: storeRes.storeOne.searchbarText,
			title: storeRes.storeOne.title,
			twitterUrl: storeRes.storeOne.twitterUrl,
			websiteLegalName: storeRes.storeOne.websiteLegalName,
			websiteName: storeRes.storeOne.websiteName,
			weightUnit: storeRes.storeOne.weightUnit,
			youtubeUrl: storeRes.storeOne.youtubeUrl,
			IMAGE_CDN_URL: storeRes.storeOne.IMAGE_CDN_URL
		}
		cookies.set('store', JSON.stringify(store), { path: '/' })
		locals.store = store
	} catch (e) { }

	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
