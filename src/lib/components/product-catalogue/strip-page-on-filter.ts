import { getDesktopFilterState } from '$lib/core/composables/index.js'

/**
 * Every filter mutation in the vendored `DesktopFilterState` (apply, tag toggle, general filter
 * checkbox, price slider, clear-all) rewrites the URL and navigates *without* removing `page`. A
 * shopper on page 3 who ticks a tag keeps `?page=3`, and the narrowed result set usually has fewer
 * pages — so they land on "No products found" with filters that clearly should match something.
 *
 * The composable lives in node_modules and cannot be edited, but all of those mutations funnel
 * through one shared `SerialNavigator.goto`, so wrapping that single choke point fixes every one of
 * them (desktop and mobile filters share the instance). Sorting already deletes `page` itself, and
 * pagination navigates via `$app/navigation` directly, so neither is affected.
 *
 * Call once per listing page, immediately after `setDesktopFilterState()`.
 */
export function stripPageOnFilterNavigation() {
	const navigator = getDesktopFilterState()?.navigator as any
	if (!navigator || navigator.__stripsPageParam) return

	const navigate = navigator.goto.bind(navigator)
	navigator.goto = (url: URL, options?: unknown) => {
		url.searchParams.delete('page')
		return navigate(url, options)
	}
	navigator.__stripsPageParam = true
}
