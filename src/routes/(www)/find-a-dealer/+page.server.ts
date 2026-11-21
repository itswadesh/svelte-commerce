import { error } from '@sveltejs/kit'

// Only where a dealer covers some territory. Anywhere else the form could only promise a dealer
// that does not exist.
export const load = async ({ parent }) => {
	const { trade } = await parent()
	if (!trade?.dealers) throw error(404, 'Page not found')
}
