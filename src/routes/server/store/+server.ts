import { gett } from '$lib/utils'
// @ts-ignore
import { PUBLIC_DOMAIN } from '$env/static/public'
export async function GET({ request, cookies }) {
	const HOST = PUBLIC_DOMAIN
	const url = new URL(request.url)
	const storeRes = await gett(`init?domain=${HOST || url.host}`)
	const { storeOne, settings, popularSearches, megamenu } = storeRes
	const store = {
		id: storeOne._id,
		domain: storeOne.domain,
		email: storeOne.email,
		address: storeOne.address,
		phone: storeOne.phone,
		otpLogin: storeOne.otpLogin,
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
		GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID
	}
	cookies.set('store', JSON.stringify(store), { path: '/' })
	return new Response(JSON.stringify({ storeOne, settings: {}, popularSearches, megamenu }))
}
