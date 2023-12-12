export const prerender = false
export const load = async ({ parent }) => {
	const data = await parent()
	return data
}
