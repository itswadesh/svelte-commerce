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
	youtubeChannel
} from '$lib/config'
export const getStoreData=async ({cookieStore,url,cookies,server=false,sid=null}:any) => {
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
			youtubeChannel
		}
		if (!cookieStore || cookieStore === 'undefined') {
			const uri = new URL(url)
			const storeRes = await getBySid(`init?domain=${DOMAIN || uri.host}`)
			const { storeOne, settings } = storeRes
			store = {
				id: storeOne._id,
				address: storeOne.address,
				searchbarText: storeOne.searchbarText,
				adminUrl: storeOne.adminUrl || settings.adminUrl, // storeOne.adminUrl used for arialmall
				closed: storeOne.closed,
				closedMessage: storeOne.closedMessage,
				description: storeOne.description,
				dimentionUnit: storeOne.dimentionUnit,
				domain: storeOne.domain,
				DOMAIN: storeOne.DOMAIN,
				email: storeOne.websiteEmail,
				otpLogin: storeOne.otpLogin || true,
				loginUrl: storeOne.otpLogin ? '/auth/otp-login' : '/auth/login',
				facebookPage: storeOne.facebookPage,
				GOOGLE_ANALYTICS_ID: storeOne.GOOGLE_ANALYTICS_ID,
				GOOGLE_CLIENT_ID: storeOne.GOOGLE_CLIENT_ID,
				instagramPage: storeOne.instagramPage,
				isFnb: storeOne.isFnb,
				keywords: storeOne.keywords,
				linkedinPage: storeOne.linkedinPage,
				logo: storeOne.logo,
				phone: storeOne.phone,
				pinterestPage: storeOne.pinterestPage,
				stripePublishableKey: storeOne.stripePublishableKey,
				title: storeOne.title,
				twitterPage: storeOne.twitterPage,
				websiteLegalName: storeOne.websiteLegalName,
				websiteName: storeOne.websiteName,
				weightUnit: storeOne.weightUnit,
				youtubeChannel: storeOne.youtubeChannel,
				currencySymbol: storeOne.storeCurrency?.symbol || '$',
				currencyCode: storeOne.storeCurrency?.isoCode || 'USD'
			}
			cookies.set('store', JSON.stringify(store), { path: '/' })
		} else {
			store = JSON.parse(cookieStore)
		}
		return store
}