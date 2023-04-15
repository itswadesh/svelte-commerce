import { DOMAIN, IS_DEV } from '$lib/config'
import { getBySid } from '$lib/utils/server'
// @ts-ignore
export async function GET({ request, cookies, locals }) {
	const uri = new URL(request.url)
	// console.log('zzzzzzzzzzzzzzzzzz', `init?domain=${IS_DEV ? DOMAIN : uri.host}`)
	const storeRes = await getBySid(`init?domain=${IS_DEV ? DOMAIN : uri.host}`)
	const { storeOne, settings, popularSearches, megamenu } = storeRes
	const store = {
		id: storeOne?._id,
		address: storeOne?.address,
		adminUrl: storeOne?.adminUrl || settings?.adminUrl, // storeOne?.adminUrl used for arialmall
		closed: storeOne?.closed,
		closedMessage: storeOne?.closedMessage,
		currencyCode: storeOne?.storeCurrency?.isoCode || 'USD',
		currencySymbol: storeOne?.storeCurrency?.symbol || '$',
		description: storeOne?.description,
		domain: storeOne?.domain,
		DOMAIN: storeOne?.DOMAIN,
		email: storeOne?.websiteEmail,
		facebookUrl: storeOne?.facebookUrl,
		GOOGLE_ANALYTICS_ID: storeOne?.GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID: storeOne?.GOOGLE_CLIENT_ID,
		instagramUrl: storeOne?.instagramUrl,
		isFnb: storeOne?.isFnb,
		keywords: storeOne?.keywords,
		linkedinUrl: storeOne?.linkedinUrl,
		loginUrl: storeOne?.otpLogin ? '/auth/login' : '/auth/login',
		logo: storeOne?.logo,
		otpLogin: storeOne?.otpLogin || true,
		phone: storeOne?.phone,
		pinterestUrl: storeOne?.pinterestUrl,
		searchbarText: storeOne?.searchbarText,
		stripePublishableKey: storeOne?.stripePublishableKey,
		title: storeOne?.title,
		twitterUrl: storeOne?.twitterUrl,
		websiteLegalName: storeOne?.websiteLegalName,
		websiteName: storeOne?.websiteName,
		youtubeUrl: storeOne?.youtubeUrl
	}
	locals.store = store
	cookies.set('store', JSON.stringify(store), { path: '/' })
	return new Response(JSON.stringify({ storeOne, settings, popularSearches, megamenu }))
}
