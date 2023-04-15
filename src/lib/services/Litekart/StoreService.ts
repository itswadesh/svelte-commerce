import { getBySid } from '$lib/utils/server'
import {
	id,
	address,
	searchbarText,
	adminUrl,
	dimentionUnit,
	loginUrl,
	weightUnit,
	currencyCode,
	currencySymbol,
	closedMessage,
	description,
	domain,
	DOMAIN,
	email,
	facebookUrl,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	HTTP_ENDPOINT,
	instagramUrl,
	keywords,
	linkedinUrl,
	logo,
	phone,
	pinterestUrl,
	siteTitle,
	stripePublishableKey,
	twitterUrl,
	websiteLegalName,
	websiteName,
	WWW_URL,
	youtubeUrl,
	IS_DEV,
	alert
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
		searchbarText,
		adminUrl,
		closed: false,
		closedMessage,
		description,
		dimentionUnit,
		domain,
		DOMAIN,
		email,
		facebookUrl,
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		instagramUrl,
		otpLogin: false,
		loginUrl,
		isFnb: false,
		keywords,
		linkedinUrl,
		logo,
		phone,
		pinterestUrl,
		stripePublishableKey,
		title: siteTitle,
		twitterUrl,
		websiteLegalName,
		websiteName,
		weightUnit,
		currencyCode,
		currencySymbol,
		youtubeUrl,
		alert
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
		searchbarText: storeRes.storeOne.searchbarText,
		adminUrl: storeRes.storeOne.adminUrl || storeRes.settings.adminUrl, // storeRes.storeOne.adminUrl used for arialmall
		closed: storeRes.storeOne.closed,
		closedMessage: storeRes.storeOne.closedMessage,
		description: storeRes.storeOne.description,
		dimentionUnit: storeRes.storeOne.dimentionUnit,
		domain: storeRes.storeOne.domain,
		DOMAIN: storeRes.storeOne.DOMAIN,
		email: storeRes.storeOne.websiteEmail,
		otpLogin: storeRes.storeOne.otpLogin || true,
		loginUrl: storeRes.storeOne.otpLogin ? '/auth/login' : '/auth/login',
		facebookUrl: storeRes.storeOne.facebookUrl,
		GOOGLE_ANALYTICS_ID: storeRes.storeOne.GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID: storeRes.storeOne.GOOGLE_CLIENT_ID,
		instagramUrl: storeRes.storeOne.instagramUrl,
		isFnb: storeRes.storeOne.isFnb,
		keywords: storeRes.storeOne.keywords,
		linkedinUrl: storeRes.storeOne.linkedinUrl,
		logo: storeRes.storeOne.logo,
		phone: storeRes.storeOne.phone,
		pinterestUrl: storeRes.storeOne.pinterestUrl,
		stripePublishableKey: storeRes.storeOne.stripePublishableKey,
		title: storeRes.storeOne.title,
		twitterUrl: storeRes.storeOne.twitterUrl,
		websiteLegalName: storeRes.storeOne.websiteLegalName,
		websiteName: storeRes.storeOne.websiteName,
		weightUnit: storeRes.storeOne.weightUnit,
		youtubeUrl: storeRes.storeOne.youtubeUrl,
		currencySymbol: storeRes.storeOne.storeCurrency?.symbol || '$',
		currencyCode: storeRes.storeOne.storeCurrency?.isoCode || 'USD',
		alert: storeRes.storeOne.alert
	}
	cookies.set('store', JSON.stringify(store), { path: '/' })
	// } else {
	// 	store = JSON.parse(cookieStore)
	// }
	storeRes.storeOne = store
	return storeRes
}
