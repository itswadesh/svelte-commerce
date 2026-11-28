import { wwwCategoriesLoadServer } from '$lib/core/load-functions/index.js'
import { gocommerceEngine, gocommerceStore } from '$lib/server/gocommerce'
import { activeBackendProxy } from '$lib/core/connectors/init'
import type { ServerLoad } from '@sveltejs/kit'

// The core loader fills every category's `img` with a *guessed* URL on another company's bucket —
// `https://s3.ap-south-1.amazonaws.com/litekart.in/categories/<slug>.png` — whenever the category
// has no thumbnail of its own, and its hardcoded fallback list points at six more of the same.
// For any store that is not litekart.in those URLs are hotlinked third-party assets at best and
// broken images at worst. Strip them so the page renders its own picture or initial instead.
const FOREIGN_IMAGE = /s3\.[a-z0-9-]+\.amazonaws\.com\/litekart\.in\//i

type Card = { name: string; slug: string; img?: string; count?: number }
type Category = Card & { id?: string; children?: Card[] }

// The engine's own paths (/media/…, /sample-media/…) go out the way the connector's mediaUrl sends
// its pictures: through this storefront's proxy mount when there is one, else from the engine
// itself. A full URL stays as it is.
const media = (url: unknown, engine: string) =>
	typeof url !== 'string' || !url
		? undefined
		: url.startsWith('/') && !url.startsWith('//')
			? `${(activeBackendProxy()?.path ?? engine).replace(/\/+$/, '')}${url}`
			: url

// ponytail: one engine call per card, capped; a store with more cards shows the rest without a picture or count.
const MAX_LOOKUPS = 60

/**
 * A GoCommerce category's product count (its sub-categories' products included) and its first
 * product's picture, which the card shows when the merchant gave the category none. Undefined on
 * any failure: the card then has no count rather than a wrong one.
 */
async function facts(engine: string, store: string, slug: string, fetchFn: typeof fetch) {
	try {
		const res = await fetchFn(`${engine.replace(/\/+$/, '')}/api/categories/${encodeURIComponent(slug)}?limit=1`, {
			headers: { accept: 'application/json', 'x-store': store },
			signal: AbortSignal.timeout(2500)
		})
		if (!res.ok) return undefined
		const body = await res.json()
		const total = Number(body?.meta?.total)
		return { count: Number.isFinite(total) ? total : undefined, img: media(body?.data?.products?.[0]?.image_url, engine) }
	} catch {
		return undefined
	}
}

export const load: ServerLoad = async (event) => {
	// Deliberately not re-typed: annotating the return here would narrow the category shape the
	// page consumes (slug, name, children) down to whatever this file happens to name.
	const data = await wwwCategoriesLoadServer(event)
	const categories = (data?.categories ?? []) as Category[]

	for (const category of categories) {
		if (category?.img && FOREIGN_IMAGE.test(category.img)) category.img = ''
	}

	const engine = gocommerceEngine()
	const store = gocommerceStore(event.url.host.replace(/:\d+$/, ''))
	if (engine && store) {
		const cards = categories.flatMap((c) => [c, ...(c.children ?? [])]).slice(0, MAX_LOOKUPS)
		await Promise.all(
			cards.map(async (card) => {
				const found = await facts(engine, store, card.slug, fetch)
				if (!found) return
				card.count = found.count
				card.img ||= found.img
			})
		)
	}

	return data
}
