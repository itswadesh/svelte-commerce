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
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	IMAGE_CDN_URL,
	keywords,
	loginUrl,
	logo,
	phone,
	searchbarText,
	siteTitle,
	websiteLegalName,
	websiteName,
	weightUnit,
} from '$lib/config'
import { fetchInit } from './init-service'

export const getStoreData = async ({
	cookieStore,
	cookieMegamenu,
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
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		hellobar: {},
		IMAGE_CDN_URL: IMAGE_CDN_URL,
		isDeals: false,
		isDiscountCoupons: false,
		isFnb: false,
		isGDPR: false,
		isProductReviewsAndRatings: false,
		isSecureCatalogue: false,
		isWhatsappChatButton: false,
		isWishlist: false,
		keywords,
		loginUrl,
		logo,
		otpLogin: false,
		phone,
		searchbarText,
		socialSharingButtons: {},
		title: siteTitle,
		websiteLegalName,
		websiteName,
		weightUnit,
	}
	let megamenu = null
	if (
		!cookieStore ||
		cookieStore === 'undefined' ||
		!cookieMegamenu ||
		cookieMegamenu == 'undefined'
	) {
		const uri = new URL(url)
		storeRes = await fetchInit(uri.host)

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
		megamenu = storeRes.megamenu
		cookies.set('store', JSON.stringify(store), { path: '/' })
		cookies.set('megamenu', JSON.stringify(megamenu), { path: '/' })
	} else {
		store = JSON.parse(cookieStore)
		megamenu = JSON.parse(cookieMegamenu)
	}
	storeRes.storeOne = store
	storeRes.megamenu = megamenu
	return storeRes
}
