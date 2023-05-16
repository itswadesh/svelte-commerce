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
	instagramUrl,
	keywords,
	linkedinUrl,
	loginUrl,
	logo,
	phone,
	pinterestUrl,
	searchbarText,
	siteTitle,
	twitterUrl,
	websiteLegalName,
	websiteName,
	weightUnit,
	youtubeUrl,
	IMAGE_CDN_URL
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
		facebookUrl,
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		instagramUrl,
		hellobar: {},
		isSecureCatalogue: false,
		isProductReviewsAndRatings: false,
		isGDPR: false,
		isFnb: false,
		isDiscountCoupons: false,
		isDeals: false,
		isWhatsappChatButton: false,
		isWishlist: false,
		keywords,
		linkedinUrl,
		loginUrl,
		logo,
		otpLogin: false,
		phone,
		pinterestUrl,
		searchbarText,
		title: siteTitle,
		twitterUrl,
		websiteLegalName,
		websiteName,
		weightUnit,
		youtubeUrl,
		IMAGE_CDN_URL: IMAGE_CDN_URL
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

		megamenu = storeRes.megamenu

		cookies.set('store', JSON.stringify(store), { path: '/' })

		try {
			cookies.set('megamenu', JSON.stringify(megamenu), { path: '/' })
		} catch (e) {

		}
	} else {
		store = JSON.parse(cookieStore)
		megamenu = JSON.parse(cookieMegamenu)
	}

	storeRes.storeOne = store
	storeRes.megamenu = megamenu


	return storeRes
}
