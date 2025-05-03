import { VendorService } from '$lib/core/services'
import type { Vendor } from '$lib/core/types'
import { error } from '@sveltejs/kit'

function transformVendorOptions(options: Vendor['options']) {
	return options?.map((option) => {
		const added = new Set<string>([])

		option.values = option?.values
			?.map((v) => {
				if (added.has(v.value)) {
					return null as any
				}

				added.add(v.value)
				return v
			})
			?.filter((v) => v)

		return option
	})
}

export const load: PageLoad = async ({ fetch, params }) => {
	const slug = params.slug
	try {
		const vendor = await VendorService.getOne(slug)

		if (vendor.options?.length) {
			vendor.options = transformVendorOptions(vendor.options)
		}

		let brandratings = await VendorService.getAllVendorRatings(slug)
		let allratings = brandratings.data
		return {
			vendor: vendor as Vendor,
			allratings
		}
	} catch (e) {
		error(404, 'Vendor not found')
	}
}

