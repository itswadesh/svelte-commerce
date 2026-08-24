import * as saleor from '@misiki/saleor-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// Saleor-only connector. Everything the backend itself can answer for — orders, the customer guard,
// categories, collections, profile, and honest empty states for what Saleor does not have (CMS
// pages beyond its own, blog, wishlist, coupon lists, Meilisearch) — lives in
// @misiki/saleor-connector (>= 1.0.4). What remains here is what only this storefront can answer.
export * from '@misiki/saleor-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_SALEOR_* env.
export const connectorName = 'saleor'

// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
// Saleor equivalent, so the connector reads it from here: default-store.json merged under the
// project's kitcommerce.config.ts default export. Registered at module load, before any service can
// ask for it.
// Optional on purpose: a connector older than 1.0.4 has no such hook, and a bare named import of
// it fails the whole module at load ("does not provide an export named 'setStaticStore'"), taking
// the storefront down over a version skew. Without it the store record still resolves —
// local-store-data.ts answers `/api/stores/public-details` from the same config.
;(saleor as { setStaticStore?: (fn: typeof staticStoreConfig) => void }).setStaticStore?.(staticStoreConfig)

// Local data first — countries, currencies, plugin toggles, the rest of the store record — then the
// net: nothing in Saleor mode may fall through to a Litekart REST path, because that API is neither
// installed nor running. See rest-guard.ts.
serveRestLocally(localStoreData)
blockRestFallbacks(saleor.BaseService, 'saleor')
