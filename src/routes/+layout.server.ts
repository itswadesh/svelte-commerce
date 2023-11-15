export const load = async ({ locals, url, fetch }) => {
	const currentPage = +url.searchParams.get('page') || 1
	const q = url.searchParams.get('q') || ''
	const { pathname, host } = url
	locals.currentPage = currentPage
	locals.q = q
	// Can not do it directly from here because it will not cached
	// const res2 = await fetch('/server/store')
	// const storeFromServer = await res2.json()
	// locals.store = storeFromServer.store
	// locals.megamenu = storeFromServer.megamenu
	// locals.menu = storeFromServer.menu
	// locals.popularSearches = storeFromServer.popularSearches
	return { ...locals, pathname, host, q, currentPage }
}
