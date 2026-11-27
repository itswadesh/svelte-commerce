// The desktop mega menu's data and keys, kept out of the component so they can be tested alone.

/** A menu node as the connectors give it: menu-builder nodes nest under `items`, category nodes under `children`. */
export type MenuNode = {
	name?: string
	link?: string
	items?: MenuNode[]
	children?: MenuNode[]
	thumbnail?: string
	image?: string
}

export type MegaLink = { name: string; link: string }
export type MegaColumn = MegaLink & { links: MegaLink[] }

const kids = (node: MenuNode | undefined) => node?.items ?? node?.children ?? []

// A node with no name or no link would draw an empty heading or a link to nowhere, so it is left out.
const usable = (node: MenuNode): node is MenuNode & MegaLink => !!node?.name?.trim() && !!node?.link?.trim()

/**
 * A top item's panel: each second-level item is a column heading with its third-level links under it.
 * A fourth level, which the engine allows, is not drawn; the third-level page lists it.
 */
export function megaColumns(item: MenuNode | undefined): MegaColumn[] {
	return kids(item)
		.filter(usable)
		.map((col) => ({
			name: col.name,
			link: col.link,
			links: kids(col)
				.filter(usable)
				.map(({ name, link }) => ({ name, link }))
		}))
}

/**
 * Whether a top item gets the full-width panel. Only a grouped menu (some second-level item has its
 * own links) does; a plain two-level menu gets a compact dropdown, since its items as column headings
 * left a full-width panel mostly empty.
 */
export const isMega = (columns: MegaColumn[]) => columns.some((col) => col.links.length > 0)

/** The promo picture, only when the menu data carries one. None is ever made up. */
export const promoImage = (item: MenuNode | undefined) => item?.image || item?.thumbnail || undefined

/**
 * Where an arrow, Home or End key moves focus in a row of `count` items, or -1 when the key is not
 * one of them. Both arrow pairs work, and the ends wrap, so the triggers and a panel's links move alike.
 */
export function menuKey(key: string, index: number, count: number): number {
	if (count <= 0) return -1
	switch (key) {
		case 'ArrowRight':
		case 'ArrowDown':
			return (index + 1) % count
		case 'ArrowLeft':
		case 'ArrowUp':
			return (index - 1 + count) % count
		case 'Home':
			return 0
		case 'End':
			return count - 1
		default:
			return -1
	}
}
