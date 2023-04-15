import { getBySid } from '$lib/utils/server'
import {
	id,
	address,
	adminUrl,
	alert,
	closedMessage,
	currencyCode,
	currencySymbol,
	description,
	dimentionUnit,
	domain,
	DOMAIN,
	email,
	facebookUrl,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	HTTP_ENDPOINT,
	instagramUrl,
	IS_DEV,
	keywords,
	linkedinUrl,
	loginUrl,
	logo,
	phone,
	pinterestUrl,
	searchbarText,
	siteTitle,
	stripePublishableKey,
	twitterUrl,
	websiteLegalName,
	websiteName,
	weightUnit,
	WWW_URL,
	youtubeUrl,
} from '$lib/config'
export const getStoreData = async ({
	cookieStore,
	url,
	cookies,
	server = false,
	sid = null
}: any) => {
	let storeRes: any = {}
	let store = {
		id,
		address,
		adminUrl,
		alert,
		closed: false,
		closedMessage,
		currencyCode,
		currencySymbol,
		description,
		dimentionUnit,
		domain,
		DOMAIN,
		email,
		facebookUrl,
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		instagramUrl,
		isFnb: false,
		keywords,
		linkedinUrl,
		loginUrl,
		logo,
		otpLogin: false,
		phone,
		pinterestUrl,
		searchbarText,
		stripePublishableKey,
		title: siteTitle,
		twitterUrl,
		websiteLegalName,
		websiteName,
		weightUnit,
		youtubeUrl,
	}
	// if (!cookieStore || cookieStore === 'undefined') {
	const uri = new URL(url)

	storeRes = await getBySid(`init?domain=${IS_DEV ? DOMAIN : uri.host}`)
	if (!storeRes.storeOne) {
		throw new Error('Store not found')
	}
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
		isFnb: storeRes.storeOne.isFnb,
		keywords: storeRes.storeOne.keywords,
		linkedinUrl: storeRes.storeOne.linkedinUrl,
		loginUrl: storeRes.storeOne.otpLogin ? '/auth/login' : '/auth/login',
		logo: storeRes.storeOne.logo,
		otpLogin: storeRes.storeOne.otpLogin || true,
		phone: storeRes.storeOne.phone,
		pinterestUrl: storeRes.storeOne.pinterestUrl,
		searchbarText: storeRes.storeOne.searchbarText,
		stripePublishableKey: storeRes.storeOne.stripePublishableKey,
		title: storeRes.storeOne.title,
		twitterUrl: storeRes.storeOne.twitterUrl,
		websiteLegalName: storeRes.storeOne.websiteLegalName,
		websiteName: storeRes.storeOne.websiteName,
		weightUnit: storeRes.storeOne.weightUnit,
		youtubeUrl: storeRes.storeOne.youtubeUrl,
	}
	cookies.set('store', JSON.stringify(store), { path: '/' })
	// } else {
	// 	store = JSON.parse(cookieStore)
	// }
	storeRes.storeOne = store
	return storeRes
}
