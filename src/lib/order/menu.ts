// The quick-order page's menu (GoCommerce D255): every product the store sells, grouped by its
// category, one row per size, so a shopper picks a whole order on one page. Built from the
// connector's storefront products; prices stay in the major units the connector gives.

export type MenuRow = {
	productId: string
	variantId: string
	title: string
	/** The size or option; empty for a product sold one way. */
	label: string
	price: number
	soldOut: boolean
}
export type MenuItem = { productId: string; title: string; slug: string; image: string | null; rows: MenuRow[] }
export type MenuGroup = { name: string; slug: string; items: MenuItem[] }

type Variant = {
	id: string | number
	title?: string
	price?: number
	stock?: number
	manageInventory?: boolean
	allowBackorder?: boolean
}
type Product = {
	id: string | number
	slug: string
	title: string
	thumbnail?: string | null
	category?: { name?: string; slug?: string } | null
	variants?: Variant[]
}

// The same rule the product page's button follows: counted, not backordered, none left.
const soldOut = (v: Variant) => !!v.manageInventory && !v.allowBackorder && !(Number(v.stock) > 0)

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '') || 'items'

export function buildMenu(products: Product[]): MenuGroup[] {
	const groups = new Map<string, MenuGroup>()
	for (const p of products) {
		const variants = p.variants ?? []
		if (!variants.length) continue
		const single = variants.length === 1
		const item: MenuItem = {
			productId: String(p.id),
			title: p.title,
			slug: p.slug,
			image: p.thumbnail ?? null,
			rows: variants.map((v) => ({
				productId: String(p.id),
				variantId: String(v.id),
				title: p.title,
				// The connector names an optionless product's one variant 'default'.
				label: single || v.title === 'default' ? '' : (v.title ?? ''),
				price: Number(v.price) || 0,
				soldOut: soldOut(v)
			}))
		}
		const name = p.category?.name?.trim() ?? ''
		const key = name.toLowerCase()
		if (!groups.has(key)) groups.set(key, { name, slug: name ? p.category?.slug || slugify(name) : 'other-items', items: [] })
		groups.get(key)!.items.push(item)
	}
	// Categories in the order the catalogue first names them; the uncategorised last.
	return [...groups.values()].sort((a, b) => Number(!a.name) - Number(!b.name))
}

/** The groups and items whose name or a size has every word of the query in it. */
export function filterMenu(groups: MenuGroup[], query: string): MenuGroup[] {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean)
	if (!words.length) return groups
	const hit = (item: MenuItem) => {
		const text = [item.title, ...item.rows.map((r) => r.label)].join(' ').toLowerCase()
		return words.every((w) => text.includes(w))
	}
	return groups.map((g) => ({ ...g, items: g.items.filter(hit) })).filter((g) => g.items.length)
}
