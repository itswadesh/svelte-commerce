import type { Error } from '$lib/types'
import { error } from '@sveltejs/kit'
import { getBySid } from '$lib/utils/server'
import { getAPI } from '$lib/utils/api'
const isServer = import.meta.env.SSR

export const findZip = async ({ zip, origin }) => {
	try {
		let data = {}
		if (isServer) data = getBySid(`pincodes/${zip}`)
		else data = getAPI(`pincodes/${zip}`, origin)
		return data
	} catch (err) {
		// console.log(err)
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const findByCity = async (locals: App.Locals, q: string) => {
	try {
		const data = await getBySid(`pincodes?${q}`)
		return data
	} catch (err) {
		// console.log(err)
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const groupByCity = async (locals: App.Locals, id: string) => {
	try {
		const data = await getBySid(`pincodes/group-by-city`)
		return data
	} catch (err) {
		// console.log(err)
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const groupByState = async (locals: App.Locals, id: string) => {
	try {
		const data = await getBySid(`pincodes/group-by-state`)
		return data
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}
 