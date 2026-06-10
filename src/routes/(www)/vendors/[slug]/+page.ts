import { VendorService } from '$lib/core/services'
import type { Vendor } from '$lib/core/types'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

type VendorOptionValue = {
	value: string
	[key: string]: unknown
}

type VendorOption = {
	values?: VendorOptionValue[]
	[key: string]: unknown
}

type VendorWithOptions = Vendor & {
	options?: VendorOption[]
}

function transformVendorOptions(options: VendorOption[] | undefined) {
	return options?.map((option) => {
		const added = new Set<string>([])

		option.values = option?.values
			?.map((v) => {
				if (added.has(v.value)) {
					return null
				}

				added.add(v.value)
				return v
			})
			?.filter((v): v is VendorOptionValue => Boolean(v))

		return option
	})
}

export const load: PageLoad = async ({ fetch, params }) => {
	const slug = params.slug
	try {
		const vendorService = new VendorService(fetch)
		const vendor = (await vendorService.getVendor(slug)) as VendorWithOptions

		if (vendor.options?.length) {
			vendor.options = transformVendorOptions(vendor.options)
		}

		const allratings = await vendorService.getAllVendorRatings(slug)
		return {
			vendor: vendor as Vendor,
			allratings
		}
	} catch (e) {
		error(404, 'Vendor not found')
	}
}
