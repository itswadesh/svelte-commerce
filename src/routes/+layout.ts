export const prerender = false
export const load = async ({ parent, data, fetch }) => {
	await parent()

	try {
		const res2 = await fetch('/server/store')
		const storeFromServer = await res2.json()

		console.log('storeFromServer', storeFromServer)

		// locals.storeId = storeFromServer.store?.id
		data.storeId = storeFromServer.storeId
		data.store = storeFromServer.store
		// data.megamenu = storeFromServer.megamenu
		// data.menu = storeFromServer.menu
		// data.popularSearches = storeFromServer.popularSearches

		return { ...data }
	} catch (e) {
		console.log('routes/layout.ts................', e.toString())
		// error(
		// 	404,
		// 	`Store Not Found @Layout
		// 	<br/>ID: ${data.storeId}
		// 	<br/>ORIGIN: ${data.origin}
		// 	<br/>DOMAIN(env): ${DOMAIN}
		// 	<br/>HTTP_ENDPOINT(env): ${HTTP_ENDPOINT}`
		// )
	}
}
