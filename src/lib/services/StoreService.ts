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
	facebookPage,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	HTTP_ENDPOINT,
	instagramPage,
	keywords,
	linkedinPage,
	logo,
	phone,
	pinterestPage,
	siteTitle,
	stripePublishableKey,
	twitterPage,
	websiteLegalName,
	websiteName,
	WWW_URL,
	youtubeChannel,
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
		facebookPage,
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		instagramPage,
		otpLogin: false,
		loginUrl,
		isFnb: false,
		keywords,
		linkedinPage,
		logo,
		phone,
		pinterestPage,
		stripePublishableKey,
		title: siteTitle,
		twitterPage,
		websiteLegalName,
		websiteName,
		weightUnit,
		currencyCode,
		currencySymbol,
		youtubeChannel,
		alert
	}
	// if (!cookieStore || cookieStore === 'undefined') {
	const uri = new URL(url)
	storeRes = await getBySid(`init?domain=${IS_DEV ? DOMAIN : uri.host}`)
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
		loginUrl: storeRes.storeOne.otpLogin ? '/auth/otp-login' : '/auth/login',
		facebookPage: storeRes.storeOne.facebookPage,
		GOOGLE_ANALYTICS_ID: storeRes.storeOne.GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID: storeRes.storeOne.GOOGLE_CLIENT_ID,
		instagramPage: storeRes.storeOne.instagramPage,
		isFnb: storeRes.storeOne.isFnb,
		keywords: storeRes.storeOne.keywords,
		linkedinPage: storeRes.storeOne.linkedinPage,
		logo: storeRes.storeOne.logo,
		phone: storeRes.storeOne.phone,
		pinterestPage: storeRes.storeOne.pinterestPage,
		stripePublishableKey: storeRes.storeOne.stripePublishableKey,
		title: storeRes.storeOne.title,
		twitterPage: storeRes.storeOne.twitterPage,
		websiteLegalName: storeRes.storeOne.websiteLegalName,
		websiteName: storeRes.storeOne.websiteName,
		weightUnit: storeRes.storeOne.weightUnit,
		youtubeChannel: storeRes.storeOne.youtubeChannel,
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
