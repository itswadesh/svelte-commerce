import {
	id,
	address,
	adminUrl,
	alert,
	currencyCode,
	currencySymbol,
	description,
	dimentionUnit,
	domain,
	DOMAIN,
	email,
	GOOGLE_ANALYTICS_ID,
	GOOGLE_CLIENT_ID,
	keywords,
	loginUrl,
	logo,
	phone,
	searchbarText,
	siteTitle,
	websiteLegalName,
	websiteName,
	themeColor,
	favicon,
	saasName,
	saasDomain,
	weightUnit,
	IMAGE_CDN_URL
} from '$lib/config'
import { fetchInit } from './init-service'

export const getStoreData = async ({
	cookieStore,
	cookieMegamenu,
	host,
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
		allowBackOrder: false,
		close: {},
		currencyCode,
		currencySymbol,
		description,
		dimentionUnit,
		domain,
		DOMAIN,
		email,
		facebookPixel: {},
		favicon,
		fontFamily: '',
		GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID,
		googleAnalytics: {},
		guaranteed_response_time: null,
		hellobar: {},
		homePageSliderBannerImageHeight: null,
		IMAGE_CDN_URL: IMAGE_CDN_URL,
		imageCdn: {},
		isBulkOrder: false,
		isDeals: false,
		isDiscountCoupons: false,
		isFnb: false,
		isGDPR: false,
		isGuestCheckout: false,
		isHyperlocal: false,
		isIndianPincodes: false,
		isMultiVendor: false,
		isPartialCheckout: false,
		isProductReviewsAndRatings: false,
		isSecureCatalogue: false,
		isWishlist: false,
		keywords,
		loginUrl,
		logo,
		otpLogin: false,
		phone,
		product_image_dimension: null,
		saasDomain,
		saasName,
		searchbarText,
		socialSharingButtons: {},
		store_timings: null,
		storeCountries: {},
		storeCountry: {},
		storeCurrencies: {},
		storeCurrency: {},
		storeLanguage: {},
		storeLanguages: {},
		storePromoVideo: {},
		themeColor,
		title: siteTitle,
		websiteLegalName,
		websiteName,
		weightUnit,
		whatsappChatButton: {}
	}

	// let megamenu = null

	// if (
	// 	!cookieStore ||
	// 	cookieStore === 'undefined' ||
	// 	!cookieMegamenu ||
	// 	cookieMegamenu == 'undefined'
	// ) {
	// const uri = new URL(url)

	storeRes = await fetchInit({ host })

	store = {
		id: storeRes?.storeOne?._id,
		address: storeRes?.storeOne?.address,
		adminUrl: storeRes?.storeOne?.adminUrl || storeRes?.settings?.adminUrl, // storeRes?.storeOne?.adminUrl used for arialmall
		alert: storeRes?.storeOne?.alert,
		allowBackOrder: storeRes.storeOne?.allowBackOrder,
		close: storeRes?.storeOne?.close,
		currencyCode: storeRes?.storeOne?.storeCurrency?.isoCode || 'USD',
		currencySymbol: storeRes?.storeOne?.storeCurrency?.symbol || '$',
		description: storeRes?.storeOne?.description,
		dimentionUnit: storeRes?.storeOne?.dimentionUnit,
		domain: storeRes?.storeOne?.domain,
		DOMAIN: storeRes?.storeOne?.DOMAIN,
		email: storeRes?.storeOne?.websiteEmail,
		facebookPixel: {
			active: storeRes?.storeOne?.facebookPixel?.active?.val,
			id: storeRes?.storeOne?.facebookPixel?.id?.val || ''
		},
		favicon: storeRes?.storeOne?.favicon || favicon,
		fontFamily: storeRes?.storeOne?.fontFamily,
		themeColor: storeRes?.storeOne?.themeColor || themeColor,
		GOOGLE_ANALYTICS_ID: storeRes?.storeOne?.GOOGLE_ANALYTICS_ID,
		GOOGLE_CLIENT_ID: storeRes?.storeOne?.GOOGLE_CLIENT_ID,
		googleAnalytics: {
			active: storeRes?.storeOne?.googleAnalytics?.active?.val,
			id: storeRes?.storeOne?.googleAnalytics?.id?.val || ''
		},
		guaranteed_response_time: storeRes?.storeOne?.guaranteed_response_time,
		hellobar: storeRes?.storeOne?.hellobar,
		homePageSliderBannerImageHeight: storeRes?.storeOne?.homePageSliderBannerImageHeight,
		IMAGE_CDN_URL: storeRes?.storeOne?.IMAGE_CDN_URL,
		isBulkOrder: storeRes?.storeOne?.isBulkOrder,
		isDeals: storeRes?.storeOne?.isDeals,
		isDiscountCoupons: storeRes?.storeOne?.isDiscountCoupons,
		isFnb: storeRes?.storeOne?.isFnb,
		isGDPR: storeRes?.storeOne?.isGDPR,
		isGuestCheckout: storeRes?.storeOne?.isGuestCheckout,
		isHyperlocal: storeRes?.storeOne?.isHyperlocal,
		isIndianPincodes: storeRes?.storeOne?.isIndianPincodes,
		isMultiVendor: storeRes?.storeOne?.isMultiVendor,
		isPartialCheckout: storeRes?.storeOne?.isPartialCheckout,
		isProductReviewsAndRatings: storeRes?.storeOne?.isProductReviewsAndRatings,
		isSecureCatalogue: storeRes?.storeOne?.isSecureCatalogue,
		isWishlist: storeRes?.storeOne?.isWishlist,
		keywords: storeRes?.storeOne?.keywords,
		loginUrl: '/auth/login',
		logo: storeRes?.storeOne?.logo,
		otpLogin: storeRes?.storeOne?.otpLogin || true,
		phone: storeRes?.storeOne?.phone,
		product_image_dimension: storeRes?.storeOne?.product_image_dimension,
		saasDomain: storeRes.storeOne.saasDomain,
		imageCdn: storeRes?.storeOne?.imageCdn,
		saasName: storeRes.storeOne.saasName,
		searchbarText: storeRes?.storeOne?.searchbarText,
		socialSharingButtons: storeRes?.storeOne?.socialSharingButtons,
		store_timings: storeRes?.storeOne?.store_timings,
		storeCountries: storeRes?.storeOne?.storeCountries,
		storeCountry: storeRes?.storeOne?.storeCountry,
		storeCurrencies: storeRes?.storeOne?.storeCurrencies,
		storeCurrency: storeRes?.storeOne?.storeCurrency,
		storeLanguage: storeRes?.storeOne?.storeLanguage,
		storeLanguages: storeRes?.storeOne?.storeLanguages,
		storePromoVideo: storeRes?.storeOne?.storePromoVideo,
		title: storeRes?.storeOne?.title,
		websiteLegalName: storeRes?.storeOne?.websiteLegalName,
		websiteName: storeRes?.storeOne?.websiteName,
		weightUnit: storeRes?.storeOne?.weightUnit,
		whatsappChatButton: storeRes?.storeOne?.whatsappChatButton
	}

	// megamenu = storeRes.megamenu

	// } else {
	// 	store = JSON.parse(cookieStore)
	// 	megamenu = JSON.parse(cookieMegamenu)
	// }

	storeRes.storeOne = store
	// storeRes.megamenu = megamenu

	return storeRes
}
