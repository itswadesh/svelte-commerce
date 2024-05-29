import {
	currencyCode,
	currencySymbol
} from '$lib/config'
import { fetchInit } from './init-service'

export const getStoreData = async ({ cookieStore, cookieMegamenu, url, cookies }: any) => {
	let storeRes: any = {}
	let store: {
		keywords: string;
		websiteLegalName: string;
		dimentionUnit: string;
		imageCdn: {};
		fontFamily: string;
		isSecureCatalogue: boolean;
		logo: {};
		id: string;
		adminUrl: string;
		GOOGLE_CLIENT_ID: string;
		facebookPixel: {};
		isProductReviewsAndRatings: boolean;
		phone: string;
		domain: string;
		isIndianPincodes: boolean;
		weightUnit: string;
		hellobar: {};
		DOMAIN: string;
		product_image_dimension: null;
		saasName: string;
		description: string;
		title: string;
		isBulkOrder: boolean;
		storePromoVideo: {};
		alert: string;
		guaranteed_response_time: null;
		loginUrl: string;
		socialSharingButtons: {};
		close: {};
		email: string;
		whatsappChatButton: {};
		address: string;
		isDeals: boolean;
		IMAGE_CDN_URL: string;
		saasDomain: string;
		currencySymbol: string;
		isHyperlocal: boolean;
		isMultiVendor: boolean;
		isGDPR: boolean;
		isFnb: boolean;
		allowBackOrder: boolean;
		searchbarText: string;
		websiteName: string;
		store_timings: null;
		googleAnalytics: {};
		isWishlist: boolean;
		homePageSliderBannerImageHeight: null;
		GOOGLE_ANALYTICS_ID: string;
		currencyCode: string;
		isDiscountCoupons: boolean
	}

	let megamenu: null

	if (
		!cookieStore ||
		cookieStore === 'undefined' ||
		!cookieMegamenu ||
		cookieMegamenu == 'undefined'
	) {
		const uri = new URL(url)

		storeRes = await fetchInit()

		store = {
			id: storeRes?.storeOne?._id,
			address: storeRes?.storeOne?.address,
			adminUrl: storeRes?.storeOne?.adminUrl || storeRes?.settings?.adminUrl, // storeRes?.storeOne?.adminUrl used for arialmall
			alert: storeRes?.storeOne?.alert,
			allowBackOrder: storeRes.storeOne?.allowBackOrder,
			close: storeRes?.storeOne?.close,
			currencyCode: storeRes?.storeOne?.storeCurrency?.isoCode || currencyCode,
			currencySymbol: storeRes?.storeOne?.storeCurrency?.symbol || currencySymbol,
			description: storeRes?.storeOne?.description,
			dimentionUnit: storeRes?.storeOne?.dimentionUnit,
			domain: storeRes?.storeOne?.domain,
			DOMAIN: storeRes?.storeOne?.DOMAIN,
			email: storeRes?.storeOne?.websiteEmail,
			facebookPixel: {
				active: storeRes?.storeOne?.facebookPixel?.active?.val,
				id: storeRes?.storeOne?.facebookPixel?.id?.val || ''
			},
			fontFamily: storeRes?.storeOne?.fontFamily,
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
			isHyperlocal: storeRes?.storeOne?.isHyperlocal,
			isIndianPincodes: storeRes?.storeOne?.isIndianPincodes,
			isMultiVendor: storeRes?.storeOne?.isMultiVendor,
			isProductReviewsAndRatings: storeRes?.storeOne?.isProductReviewsAndRatings,
			isSecureCatalogue: storeRes?.storeOne?.isSecureCatalogue,
			isWishlist: storeRes?.storeOne?.isWishlist,
			keywords: storeRes?.storeOne?.keywords,
			loginUrl: '/auth/login',
			logo: storeRes?.storeOne?.logo,
			phone: storeRes?.storeOne?.phone,
			product_image_dimension: storeRes?.storeOne?.product_image_dimension,
			saasDomain: storeRes.settings?.saasDomain,
			saasName: storeRes.settings?.saasName,
			searchbarText: storeRes?.storeOne?.searchbarText,
			socialSharingButtons: storeRes?.storeOne?.socialSharingButtons,
			store_timings: storeRes?.storeOne?.store_timings,
			storePromoVideo: storeRes?.storeOne?.storePromoVideo,
			title: storeRes?.storeOne?.title,
			websiteLegalName: storeRes?.storeOne?.websiteLegalName,
			websiteName: storeRes?.storeOne?.websiteName,
			weightUnit: storeRes?.storeOne?.weightUnit,
			whatsappChatButton: storeRes?.storeOne?.whatsappChatButton,

			imageCdn: storeRes?.storeOne?.imageCdn
		}

		megamenu = storeRes.megamenu

		// cookies.set('storeId', store?.id, { path: '/' })
		// cookies.set('megamenu', JSON.stringify(megamenu), { path: '/' })
	} else {
		store = JSON.parse(cookieStore)
		megamenu = JSON.parse(cookieMegamenu)
	}

	storeRes.storeOne = store
	storeRes.megamenu = megamenu

	return storeRes
}
