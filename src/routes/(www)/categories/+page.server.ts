import { wwwCategoriesLoadServer } from '$lib/core/load-functions/index.js'
import type { ServerLoad } from '@sveltejs/kit'

// The core loader fills every category's `img` with a *guessed* URL on another company's bucket —
// `https://s3.ap-south-1.amazonaws.com/litekart.in/categories/<slug>.png` — whenever the category
// has no thumbnail of its own, and its hardcoded fallback list points at six more of the same.
// For any store that is not litekart.in those URLs are hotlinked third-party assets at best and
// broken images at worst. Strip them so the page renders its own empty state instead.
const FOREIGN_IMAGE = /s3\.[a-z0-9-]+\.amazonaws\.com\/litekart\.in\//i

export const load: ServerLoad = async (event) => {
	// Deliberately not re-typed: annotating the return here would narrow the category shape the
	// page consumes (slug, name, children) down to whatever this file happens to name.
	const data = await wwwCategoriesLoadServer(event)

	for (const category of (data?.categories ?? []) as { img?: string }[]) {
		if (category?.img && FOREIGN_IMAGE.test(category.img)) category.img = ''
	}

	return data
}
