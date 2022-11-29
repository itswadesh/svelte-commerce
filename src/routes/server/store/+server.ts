import { DOMAIN } from '$lib/config'
import { gett } from '$lib/utils'
// @ts-ignore
export async function GET({ request, cookies, locals }) {
	const url = new URL(request.url)
	const storeRes = await gett(`init?domain=${DOMAIN || url.host}`)
	const { storeOne, settings, popularSearches, megamenu } = storeRes
	const store = {
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
		facebookPage: storeOne.facebookPage,
		instagramPage: storeOne.instagramPage,
		twitterPage: storeOne.twitterPage,
		linkedinPage: storeOne.linkedinPage,
		pinterestPage: storeOne.pinterestPage,
		youtubeChannel: storeOne.youtubeChannel,
		GOOGLE_CLIENT_ID: storeOne.GOOGLE_CLIENT_ID,
		GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID,
		DOMAIN: storeOne.DOMAIN,
		closed: storeOne.closed,
		closeMessage: storeOne.closeMessage,
		isFnb: storeOne.isFnb,
		searchbarText: storeOne.searchbarText,
		adminUrl: settings.adminUrl
	}
	locals.store = store
	cookies.set('store', JSON.stringify(store), { path: '/' })
	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
