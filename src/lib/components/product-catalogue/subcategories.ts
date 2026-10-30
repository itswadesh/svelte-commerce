export type Subcategory = { name: string; href: string; image: string | null }

type Node = { name?: string; title?: string; slug?: string; link?: string; thumbnail?: string | null; children?: Node[]; items?: Node[] }

/** The children of the category `slug` in a category tree, for the row of round pictures; none when it has none. */
export function childrenOf(tree: unknown, slug: string): Subcategory[] {
	const find = (nodes: unknown): Node | undefined => {
		if (!Array.isArray(nodes)) return undefined
		for (const node of nodes as Node[]) {
			if (node?.slug === slug) return node
			const deeper = find(node?.children ?? node?.items)
			if (deeper) return deeper
		}
	}
	const kids = find(tree)?.children ?? []
	return kids.flatMap((c) => {
		const name = (c?.name || c?.title || '').trim()
		const href = c?.link || (c?.slug ? `/${c.slug}` : '')
		return name && href ? [{ name, href, image: c?.thumbnail || null }] : []
	})
}
