import { getDesktopFilterState } from '$lib/core/composables/index.js'

/**
 * The vendored `DesktopFilterState` treats the query string as if every parameter were a facet.
 * `syncFromParams` files `search`, `sort` and `page` into `selectedGeneralFilters` alongside real
 * facet keys, and two mutations then act on that set:
 *
 *   - Apply writes each one back with `searchParams.set(key, encodeURIComponent(value))`. The
 *     setter encodes again, so `gift card` is stored as `gift%2520card` and read back as the
 *     literal `gift%20card`. A shopper who searches two words and taps Apply gets
 *     `Search Results: "gift%20card"` over an empty grid. A sorted listing loses its order the
 *     same way, while the toolbar still claims the old sort.
 *   - Clear deletes every key in that set, so clearing a filter also deletes the search term and
 *     the sort, dropping the shopper into the unfiltered catalogue with no way back.
 *
 * The composable ships in node_modules and is not ours to edit, so both are repaired here, on the
 * instance, the same way `strip-page-on-filter.ts` wraps the shared navigator.
 *
 * Call once per listing page, immediately after `setDesktopFilterState()`.
 */

/**
 * Parameters the filter panel does not own. They describe the query the filters run against, not
 * the filters themselves, so Clear must leave them alone.
 */
const NOT_A_FILTER = new Set(['search', 'sort', 'page'])

/** Decode once, and only when the value actually round-trips. */
function decodeOnce(value: string) {
	try {
		const decoded = decodeURIComponent(value)
		return decoded === value ? value : decoded
	} catch {
		// A stray `%` that is not a valid escape. Leave it exactly as it came in.
		return value
	}
}

export function scopeListingFilters() {
	const state = getDesktopFilterState() as any
	if (!state || state.__filtersScoped) return

	// Every filter mutation funnels through this one navigation, so undoing the extra layer of
	// encoding here covers Apply, tag toggles, facet checkboxes and the price slider at once.
	const navigator = state.navigator
	if (navigator && !navigator.__decodesFilterValues) {
		const navigate = navigator.goto.bind(navigator)
		navigator.goto = (url: URL, options?: unknown) => {
			for (const [key, value] of [...url.searchParams.entries()]) {
				const once = decodeOnce(value)
				if (once !== value) url.searchParams.set(key, once)
			}
			return navigate(url, options)
		}
		navigator.__decodesFilterValues = true
	}

	// Clear the filters, and only the filters. Reimplemented rather than wrapped: the original
	// deletes `Object.keys(selectedGeneralFilters)`, which is exactly the set that wrongly includes
	// the search term and the sort, so there is nothing to salvage by calling it first.
	if (typeof state.clearFilters === 'function') {
		state.clearFilters = async () => {
			const url = await state.navigator.getCurrentURL()
			for (const key of [...url.searchParams.keys()]) {
				if (!NOT_A_FILTER.has(key)) url.searchParams.delete(key)
			}
			state.selectedTags = []
			state.selectedGeneralFilters = {}
			state.minPrice = state.priceStat?.min ?? 0
			state.maxPrice = state.priceStat?.max ?? 100000
			state.showFilter = false
			return state.navigator.goto(url, { replaceState: true })
		}
	}

	state.__filtersScoped = true
}

/**
 * The filters a shopper has actually applied, read from the URL rather than from the composable's
 * `selectedGeneralFilters` — which counts `sort`, `page` and `search` as facets, so a merely
 * sorted listing reports filters that do not exist.
 *
 * `facetKeys` is the set of keys the store really serves, so a stale or hand-typed parameter does
 * not turn into a chip that cannot be explained. `tags` and the two price bounds are always the
 * panel's own.
 */
export interface AppliedFilter {
	/** Query parameter this chip removes a value from. */
	key: string
	/** The single value being removed, absent for the price range, which clears as a pair. */
	value?: string
	/** What the chip reads. */
	label: string
}

export function readAppliedFilters(url: URL, facetKeys: Iterable<string>, currencySymbol = ''): AppliedFilter[] {
	const facets = new Set(facetKeys)
	const applied: AppliedFilter[] = []

	const search = url.searchParams.get('search')
	if (search) applied.push({ key: 'search', value: search, label: `“${search}”` })

	for (const tag of (url.searchParams.get('tags') || '').split(',').filter(Boolean)) {
		applied.push({ key: 'tags', value: tag, label: tag })
	}

	for (const [key, raw] of url.searchParams.entries()) {
		if (NOT_A_FILTER.has(key) || key === 'tags' || key === 'priceFrom' || key === 'priceTo') continue
		if (!facets.has(key)) continue
		for (const value of raw.split(',').filter(Boolean)) applied.push({ key, value, label: value })
	}

	const from = url.searchParams.get('priceFrom')
	const to = url.searchParams.get('priceTo')
	if (from || to) {
		const lo = from ? `${currencySymbol}${from}` : 'Min'
		const hi = to ? `${currencySymbol}${to}` : 'Max'
		applied.push({ key: 'price', label: `${lo} – ${hi}` })
	}

	return applied
}

/** The URL with one applied filter removed, keeping everything else, and back on page one. */
export function urlWithoutFilter(url: URL, filter: AppliedFilter): string {
	const next = new URL(url)
	next.searchParams.delete('page')

	if (filter.key === 'price') {
		next.searchParams.delete('priceFrom')
		next.searchParams.delete('priceTo')
		return next.pathname + next.search
	}

	const remaining = (next.searchParams.get(filter.key) || '').split(',').filter((value) => value && value !== filter.value)

	if (remaining.length) next.searchParams.set(filter.key, remaining.join(','))
	else next.searchParams.delete(filter.key)

	return next.pathname + next.search
}

/** The URL with every filter removed, keeping the search term, the sort and the route. */
export function urlWithoutAnyFilter(url: URL): string {
	const next = new URL(url)
	for (const key of [...next.searchParams.keys()]) {
		if (!NOT_A_FILTER.has(key)) next.searchParams.delete(key)
	}
	next.searchParams.delete('page')
	return next.pathname + next.search
}
