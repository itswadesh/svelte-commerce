import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'

export async function load(event: any) {
	const data = await layoutServer(event)
	return {
		...data,
		theme: resolveStorefrontTheme(data?.store)
	}
}
