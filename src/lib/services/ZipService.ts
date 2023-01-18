import type { Project, ProjectVote,  Error } from '$lib/types'
import { error, redirect } from '@sveltejs/kit'
import { gett } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'

export const findByCity = async (locals: App.Locals, q: string): Promise<Project> => {
	try {
		const data = serializeNonPOJOs<Project>((await gett(`pincodes?${q}`)).data)
		return data
	} catch (err) {
		console.log(err)
		const e = err as Error;
			throw error(e.status, e.data.message)
	}
}

export const groupByCity = async (locals: App.Locals, id: string): Promise<Project> => {
	try {
		const data = serializeNonPOJOs<Project>((await gett(`pincodes/group-by-city`)).data)
		return data
	} catch (err) {
		console.log(err)
		const e = err as Error;
			throw error(e.status, e.data.message)
	}
}

export const groupByState = async (locals: App.Locals, id: string): Promise<Project> => {
	try {
		const data = serializeNonPOJOs<Project>((await gett(`pincodes/group-by-state`)).data)
		return data
	} catch (err) {
		const e = err as Error;
			throw error(e.status, e.data.message)
	}
}
