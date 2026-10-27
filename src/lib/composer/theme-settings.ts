/**
 * The store's published theme settings (GoCommerce ext/layouts, D127), for the root layout to
 * apply on every page.
 *
 * Read through the connector's `layoutService.getThemeSettings()`, which connectors before
 * GoCommerce 0.8.0 — and every other backend — do not have: then there are no settings and the
 * storefront keeps its own look. Reached with Reflect.get for the reason +page.ts gives: a named
 * read of a missing export would fail the whole module at load.
 *
 * Kept for thirty seconds per host, the engine's own cache time, so a busy storefront asks once
 * every half minute rather than on every request, and a publish shows within that.
 */

type Settings = Record<string, unknown>
type LayoutHook = { getThemeSettings?: () => Promise<{ settings?: Settings | null } | null> }

const TTL = 30_000
const MAX_HOSTS = 500
const cache = new Map<string, { at: number; value: Settings | null }>()

export async function publishedThemeSettings(services: object, host: string, now = Date.now()): Promise<Settings | null> {
	const hit = cache.get(host)
	if (hit && now - hit.at < TTL) return hit.value
	const layouts = Reflect.get(services, 'layoutService') as LayoutHook | undefined
	if (!layouts?.getThemeSettings) return null
	let value: Settings | null = null
	try {
		const out = await layouts.getThemeSettings()
		value = out?.settings && Object.keys(out.settings).length ? out.settings : null
	} catch {
		// A missing look must never cost the page.
	}
	cache.delete(host)
	cache.set(host, { at: now, value })
	if (cache.size > MAX_HOSTS) cache.delete(cache.keys().next().value as string)
	return value
}

/** Forget every kept answer: for tests. */
export function forgetThemeSettings() {
	cache.clear()
}
