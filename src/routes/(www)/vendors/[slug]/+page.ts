import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

// `/vendors/<slug>` shipped a loader with a 0-byte `+page.svelte`, so a successful load rendered
// an empty document with a 200 — worse than a 404, because it gets indexed as thin content.
// `/store/<slug>` is the route that actually renders a vendor storefront (products, ratings,
// chat), so this permanently redirects there rather than duplicating it.
export const load: PageLoad = ({ params }) => {
	redirect(301, `/store/${params.slug}`)
}
