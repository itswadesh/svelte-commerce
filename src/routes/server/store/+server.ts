import { domain } from '$lib/config'
import { gett } from '$lib/utils'

export async function GET({ request, locals, cookies }) {
	let init: any = {}
	const d = new Date()
	init = await gett(`init?domain=${domain}`, request.headers.get('cookie'))
	const { storeOne, settings, popularSearches } = init
	console.log('storeOne...........', storeOne)
	// console.log('settings...........', settings)
	// console.log('popularSearches...........', popularSearches)
	const d3 = new Date()
	console.log('INIT loaded at Footer: ', d3.getTime() - d.getTime())
	const {
		_id,
		stripePublishableKey,
		logo,
		email,
		address,
		phone,
		websiteName,
		websiteLegalName,
		domain,
		description,
		entity,
		siteTitle,
		siteShortTitle,
		ogLanguage,
		siteLanguage,
		icon,
		backgroundColor,
		themeColor,
		shortcuts,
		screenshots
	} = storeOne
	locals.store = {
		id: _id,
		logo,
		email,
		address,
		phone,
		websiteName,
		websiteLegalName,
		stripePublishableKey,
		domain,
		description,
		entity,
		siteTitle,
		siteShortTitle,
		ogLanguage,
		siteLanguage,
		icon,
		backgroundColor,
		themeColor,
		shortcuts,
		screenshots
	}
	cookies.set('store', JSON.stringify(locals.store), { path: '/' })
	return new Response(JSON.stringify({ storeOne, settings, popularSearches }))
}
