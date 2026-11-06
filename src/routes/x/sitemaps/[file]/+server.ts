import { error, type RequestHandler } from '@sveltejs/kit'
import { engineSitemap } from '$lib/server/engine-sitemap'

// The files /sitemap.xml lists, and the stylesheet they point at, on the shop's own host.
export const GET: RequestHandler = async (event) => {
	const file = event.params.file ?? ''
	const answer = /^[a-z0-9-]+\.(xml|xsl)$/.test(file) ? await engineSitemap(event, file) : null
	if (!answer) error(404, 'Not found')
	return answer
}
