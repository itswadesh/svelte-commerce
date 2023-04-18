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
			id: storeOne._id,
			domain: storeOne.domain,
			email: storeOne.websiteEmail,
			address: storeOne.address,
			phone: storeOne.phone,
			otpLogin: storeOne.otpLogin || true,
			loginUrl: storeOne.otpLogin ? '/auth/otp-login' : '/auth/login',
			websiteLegalName: storeOne.websiteLegalName,
			websiteName: storeOne.websiteName,
			title: storeOne.title,
			description: storeOne.description,
			keywords: storeOne.keywords,
			stripePublishableKey: storeOne.stripePublishableKey,
			logo: storeOne.logo,
			facebookUrl: storeOne.facebookUrl,
			instagramUrl: storeOne.instagramUrl,
			twitterUrl: storeOne.twitterUrl,
			linkedinUrl: storeOne.linkedinUrl,
			pinterestUrl: storeOne.pinterestUrl,
			youtubeUrl: storeOne.youtubeUrl,
			GOOGLE_CLIENT_ID: storeOne.GOOGLE_CLIENT_ID,
			GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID,
			DOMAIN: storeOne.DOMAIN,
			alert: storeOne.alert,
			closed: storeOne.closed,
			closedMessage: storeOne.closedMessage,
			isFnb: storeOne.isFnb,
			searchbarText: storeOne.searchbarText,
			adminUrl: storeOne.adminUrl || settings.adminUrl, // storeOne.adminUrl used for arialmall
			currencySymbol: storeOne.storeCurrency?.symbol || '₹',
			currencyCode: storeOne.storeCurrency?.isoCode || 'INR',
			IMAGE_CDN_URL: storeOne?.IMAGE_CDN_URL
		}
		cookies.set('store', JSON.stringify(store), { path: '/' })
		locals.store = store
	} catch (e) {}

	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
