import { getContext, onMount, setContext } from 'svelte'
import { categoryService, countryService, currencyService, regionService, stateService } from '$lib/core/services'

export class RegionState {
	region = $state<{ region_id: string; currency: { currency_code: string; currency_symbol: string; symbol_native: string } }>({
		region_id: '0',
		currency: { currency_code: 'inr', currency_symbol: '₹', symbol_native: '₹' }
	})
	regions = $state<any>([])
	isUpdatingRegion = $state<boolean>(false)
	currencies = $state<any>([])
	countries = $state<any>([])
	states = $state<any>([])
	megamenu = $state<any>([])
	isUpdatingSetting = $state<boolean>(false)

	constructor() {
		onMount(async () => {
			try {
				this.isUpdatingRegion = true
				const id = '' // this.retrieveRegionId()
				// const s = (this.region = await regionService.getRegionByRegionId(id))

				await this.listSettings()
			} catch (e) {

			} finally {
			}
			this.isUpdatingRegion = false
		})
	}

	listSettings = async () => {
		const currenciesRes = await currencyService.listCurrencies()
		this.currencies = currenciesRes.data.map((c) => {
			return { name: c.name, value: c.code }
		})
		this.megamenu = await categoryService.getMegamenu()
		this.countries = await countryService.list()
		// this.states = await stateService.list()
	}

	retrieveRegionId = () => {
		const regionId = (localStorage && localStorage.getItem('region_id')) || null
		return regionId || ''
	}

	fetchRegions = async () => {
		try {
			const regions = [{}]
			this.regions = regions
		} catch (e) {

		}
	}
}

const REGION_KEY = Symbol('REGION')

export function setRegionState() {
	return setContext(REGION_KEY, new RegionState())
}

export function getRegionState() {
	return getContext<ReturnType<typeof setRegionState>>(REGION_KEY)
}

