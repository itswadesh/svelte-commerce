export const prerender = false
export const load = async ({ parent, url }) => {
	const data = await parent()
	data.url = url.pathname
	return data
}
