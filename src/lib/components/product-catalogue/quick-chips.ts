/**
 * The phone's one-tap shortcuts above a listing (Bewakoof study, 2026-11-25): Size and Colour open
 * the filter sheet on their group, and only where the listing can filter by them; New sorts the
 * newest first, and only where there is more than one product to order.
 */
export type FilterGroup = { id: string; label: string }
export type QuickChip = { kind: 'group'; id: string; name: 'Size' | 'Colour' } | { kind: 'new' }

/** The sort "What's New" names in $lib/config. */
export const NEWEST_SORT = 'updatedAt:desc'

const named = (group: FilterGroup, pattern: RegExp) => pattern.test(group.id) || pattern.test(group.label)

export function phoneChips(groups: readonly FilterGroup[], productCount: number): QuickChip[] {
	const size = groups.find((g) => named(g, /size/i))
	const colour = groups.find((g) => named(g, /colou?r/i))
	return [
		...(size ? [{ kind: 'group', id: size.id, name: 'Size' } as const] : []),
		...(colour ? [{ kind: 'group', id: colour.id, name: 'Colour' } as const] : []),
		...(productCount > 1 ? [{ kind: 'new' } as const] : [])
	]
}

/** The listing with the newest first, or back to its default order when it already is. */
export function newestHref(url: URL): string {
	const next = new URL(url)
	if (next.searchParams.get('sort') === NEWEST_SORT) next.searchParams.delete('sort')
	else next.searchParams.set('sort', NEWEST_SORT)
	next.searchParams.delete('page')
	return next.pathname + next.search
}
