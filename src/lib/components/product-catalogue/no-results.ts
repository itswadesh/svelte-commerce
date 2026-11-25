/**
 * What a search that found nothing offers instead of a dead end (Bewakoof study, 2026-11-25): the
 * store's own categories, the searches its backend reports as popular, and products in the store's
 * own order. Only real data: a block with nothing behind it is not drawn, and nothing is ranked or
 * counted here. "Recommended" is the listing's word for the store's order (ms-search.svelte), since
 * no backend here reports what sells best.
 */
export type NoResultsLink = { name: string; href: string }

/** The top level of the store's category menu, as links, at most `limit`. */
export function topCategories(tree: unknown, limit = 8): NoResultsLink[] {
	if (!Array.isArray(tree)) return []
	const out: NoResultsLink[] = []
	for (const node of tree) {
		const name = String(node?.name ?? '').trim()
		const href = node?.link || (node?.slug ? `/${node.slug}` : '')
		if (name && href && !out.some((l) => l.href === href)) out.push({ name, href })
		if (out.length >= limit) break
	}
	return out
}

/** Popular search terms from whatever shape the backend answers with, as search links. */
export function popularSearches(answer: unknown, limit = 8): NoResultsLink[] {
	const rows = Array.isArray(answer) ? answer : Array.isArray((answer as any)?.data) ? (answer as any).data : []
	const terms: string[] = []
	for (const row of rows) {
		const term = String(typeof row === 'string' ? row : (row?.text ?? row?.q ?? row?.query ?? row?.name ?? row?.title ?? '')).trim()
		if (term && !terms.some((t) => t.toLowerCase() === term.toLowerCase())) terms.push(term)
		if (terms.length >= limit) break
	}
	return terms.map((name) => ({ name, href: `/products?search=${encodeURIComponent(name)}` }))
}
