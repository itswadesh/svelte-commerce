// import { env } from '$env/dynamic/public'
import { getContext, onMount, setContext } from 'svelte'
// import { parseCookies } from './auth.svelte'
import { storeService } from '$lib/core/services'
import { page } from '$app/state'

export class settingState {
	currencies = $state<any>([])
	countries = $state<any>([])
	states = $state<any>([])
	megamenu = $state<any>([])
	menu = $state<any>([])
	paymentMethods = $state<any>([])
	plugins = $state<any>([])
	isUpdatingSetting = $state<boolean>(false)
	selectedStore = $state<any>({})
	retrieveStoreId = () => {
		// const cookies = parseCookies(document.cookie)
		const storeId = page.data?.store?.id
		return storeId
	}

	constructor() {
		onMount(async () => {
			this.isUpdatingSetting = true
			this.listSettings()
			this.isUpdatingSetting = false
		})
	}

	async setStoreData(store: any) {
		if (!store?.id) {
			console.error('Store ID not found')
			return
		}
		this.selectedStore = store
		// await StoreService.setActiveStoreId(store.id)
	}

	listSettings = async () => {
		try {
			const storeId = this.retrieveStoreId()
			const storeDetails: any = await storeService.getStore(storeId)
			this.selectedStore = {
				name: storeDetails.name,
				description: storeDetails.description,
				logo: storeDetails.logo,
				currency: storeDetails.currency,
				currencyCode: storeDetails.currencyCode,
				currency_symbol_native: storeDetails.currency?.symbolNative,
				weight_unit: storeDetails.weightUnit,
				productImageAspectRatio: storeDetails.productImageAspectRatio,
				homepageSliderBannerHeight: storeDetails.homepageSliderBannerHeight,
				homePageSliderBannerImageHeight: storeDetails.homePageSliderBannerImageHeight,
				androidScheme: storeDetails.androidScheme,
				androidPackage: storeDetails.androidPackage,
				androidAppJson: storeDetails.androidAppJson,
				androidVersionCode: storeDetails.androidVersionCode,
				androidWebviewUrl: storeDetails.androidWebviewUrl,
				themePrimaryColor: storeDetails.themePrimaryColor,
				themeSecondaryColor: storeDetails.themeSecondaryColor,
				themeFontFamily: storeDetails.themeFontFamily,
				themeFontColor: storeDetails.themeFontColor,
				freeShippingOn: storeDetails.freeShippingOn,
				shippingCharges: storeDetails.shippingCharges,
				metaTitle: storeDetails.metaTitle || storeDetails.meta_title,
				metaDescription: storeDetails.metaDescription || storeDetails.meta_description,
				metaKeywords: storeDetails.metaKeywords || storeDetails.meta_keywords
			}
			this.megamenu = storeDetails.megamenu
			this.currencies = storeDetails.currencies
			this.countries = storeDetails.countries
			this.paymentMethods = storeDetails.paymentMethods
			this.plugins = storeDetails.plugins
			this.menu = storeDetails.menu
			// const results = await Promise.allSettled([
			// 	CurrencyService.listCurrencies(),
			// 	CategoryService.getMegamenu(),
			// 	CountryService.list(),
			// 	PaymentMethodService.list({}),
			// 	PluginService.list({}),
			// 	MenuService.list(),
			// 	storeId ? storeService.getStore(storeId) : Promise.reject('No store ID found')
			// ])

			// // Handle each result independently
			// if (results[0].status === 'fulfilled') {
			// 	this.currencies = results[0].value.data.map((c) => {
			// 		return { name: c.name, value: c.code }
			// 	})
			// } else {
			// 	console.error('Failed to fetch currencies:', results[0].reason)
			// }

			// if (results[1].status === 'fulfilled') {
			// 	this.megamenu = results[1].value?.data?.map((c) => {
			// 		return { name: c.name, value: c.code }
			// 	})
			// } else {
			// 	console.error('Failed to fetch megamenu:', results[1].reason)
			// }

			// if (results[2].status === 'fulfilled') {
			// 	this.countries = results[2].value
			// } else {
			// 	console.error('Failed to fetch countries:', results[2].reason)
			// }

			// if (results[3].status === 'fulfilled') {
			// 	this.paymentMethods = results[3].value
			// } else {
			// 	console.error('Failed to fetch payment methods:', results[3].reason)
			// }

			// if (results[4].status === 'fulfilled') {
			// 	this.plugins = results[4].value
			// } else {
			// 	console.error('Failed to fetch plugins:', results[4].reason)
			// }

			// if (results[5].status === 'fulfilled') {
			// 	this.menu = results[5].value
			// } else {
			// 	console.error('Failed to fetch plugins:', results[5].reason)
			// }

			// if (results[6].status === 'fulfilled') {
			// 	this.selectedStore = results[6].value
			// } else {
			// 	console.error('Failed to fetch store:', results[6].reason)
			// }
		} catch (e) {
			// console.log(e)
		}
	}
}

const SETTING_KEY = Symbol('SETTING')

export function setSettingState() {
	return setContext(SETTING_KEY, new settingState())
}

export function getSettingState() {
	return getContext<ReturnType<typeof setSettingState>>(SETTING_KEY)
}

