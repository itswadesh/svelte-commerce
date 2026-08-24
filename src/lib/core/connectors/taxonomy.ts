// Static import despite the cycle (kitcommerce.config.ts → connector module → this file), same as
// static-store.ts: the binding is only read inside the getters below, at render time, never during
// module evaluation.
import { services } from 'kitcommerce.config'

// What the active backend calls its product taxonomy. Vendure and Shopify have no "category"
// concept at all — theirs is collections, which the connector modules map onto the storefront's
// category services (see the CategoryService override in vendure.ts). Litekart, Medusa and Saleor
// do model categories, so they keep the term. This is display copy only: routes, services and
// internal naming stay "category" everywhere.
const COLLECTION_TAXONOMY = new Set(['vendure', 'shopify'])

// The marker every module in src/lib/core/connectors exports. A config pointed straight at a raw
// connector package has none, and falls back to "category".
const isCollectionBackend = () => COLLECTION_TAXONOMY.has((services as { connectorName?: string }).connectorName ?? '')

export const taxonomy = {
	/** "Category" / "Collection" — title case, for headings and labels. */
	get one() {
		return isCollectionBackend() ? 'Collection' : 'Category'
	},
	/** "Categories" / "Collections" — title case, for headings and labels. */
	get many() {
		return isCollectionBackend() ? 'Collections' : 'Categories'
	},
	/** "category" / "collection" — lower case, for mid-sentence copy. */
	get oneLower() {
		return isCollectionBackend() ? 'collection' : 'category'
	},
	/** "categories" / "collections" — lower case, for mid-sentence copy. */
	get manyLower() {
		return isCollectionBackend() ? 'collections' : 'categories'
	}
}
