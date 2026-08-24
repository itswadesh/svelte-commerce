// Static import despite the cycle (kitcommerce.config.ts → connector module → this file), same as
// static-store.ts: the binding is only read inside the getters below, at render time, never during
// module evaluation.
import { services } from 'kitcommerce.config'

// What the active backend calls its product taxonomy, in shopper-facing copy. Display only: routes,
// services and internal naming stay "category" everywhere, on every backend.
//
// Vendure and Shopify have no "category" concept at all — theirs is collections, which their
// connectors map onto the storefront's category services. Every other backend models categories, so
// they take the default and need no row here.
//
// Spree and Sylius are the near-miss worth naming: both model a taxon tree, and their connectors'
// category services are written against `taxons`. They are left as Category on purpose — "Taxon" is
// the word their admin uses, not the word their own storefronts show a shopper.
type Labels = { one: string; many: string }

const DEFAULT_LABELS: Labels = { one: 'Category', many: 'Categories' }

const COLLECTION_LABELS: Labels = { one: 'Collection', many: 'Collections' }

const LABELS: Record<string, Labels> = {
	vendure: COLLECTION_LABELS,
	shopify: COLLECTION_LABELS
}

// The marker every connector package exports. A config naming something we have no row for — a
// connector newer than this table — falls back to "category", which is what all but two use.
const labels = () => LABELS[(services as { connectorName?: string }).connectorName ?? ''] ?? DEFAULT_LABELS

export const taxonomy = {
	/** "Category" / "Collection" — title case, for headings and labels. */
	get one() {
		return labels().one
	},
	/** "Categories" / "Collections" — title case, for headings and labels. */
	get many() {
		return labels().many
	},
	/** "category" / "collection" — lower case, for mid-sentence copy. */
	get oneLower() {
		return labels().one.toLowerCase()
	},
	/** "categories" / "collections" — lower case, for mid-sentence copy. */
	get manyLower() {
		return labels().many.toLowerCase()
	}
}
