export const load = async ({ url, parent }) => {
	const { user } = await parent()

	const ref = url.searchParams.get('ref')
	return { ref }
}
