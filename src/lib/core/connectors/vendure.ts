import * as vendure from '@misiki/vendure-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// Vendure-only connector. Everything the backend itself can answer for — orders, the customer guard,
// the order number carried out of checkout, categories, collections, profile, and honest empty states
// for what Vendure does not have (CMS pages, blog, wishlist, coupon lists, Meilisearch) — lives in
// @misiki/vendure-connector (>= 2.0.39). What remains here is what only this storefront can answer.
export * from '@misiki/vendure-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_VENDURE_* env.
export const connectorName = 'vendure'

// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
// Vendure equivalent, so the connector reads it from here: default-store.json merged under the
// project's kitcommerce.config.ts default export. Registered at module load, before any service can
// ask for it.
// Optional on purpose: a connector older than 2.0.37 has no such hook, and a bare named import of
// it fails the whole module at load ("does not provide an export named 'setStaticStore'"), taking
// the storefront down over a version skew. Without it the store record still resolves —
// local-store-data.ts answers `/api/stores/public-details` from the same config.
;(vendure as { setStaticStore?: (fn: typeof staticStoreConfig) => void }).setStaticStore?.(staticStoreConfig)

// Local data first — countries, currencies, plugin toggles, the rest of the store record — then the
// net: nothing in Vendure mode may fall through to a Litekart REST path, because that API is neither
// installed nor running. See rest-guard.ts.
serveRestLocally(localStoreData)
blockRestFallbacks(vendure.BaseService, 'vendure')
