import * as medusa from '@misiki/medusa-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// Medusa-only connector. Everything the backend itself can answer for — orders, the customer guard,
// categories, collections, profile, payment methods, and honest empty states for what Medusa does
// not have (CMS pages, blog, wishlist, coupon lists, Meilisearch) — lives in
// @misiki/medusa-connector (>= 2.1.6). What remains here is what only this storefront can answer.
export * from '@misiki/medusa-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_MEDUSA_* env.
export const connectorName = 'medusa'

// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
// Medusa equivalent, so the connector reads it from here: default-store.json merged under the
// project's kitcommerce.config.ts default export. Registered at module load, before any service can
// ask for it.
// Optional on purpose: a connector older than 2.1.6 has no such hook, and a bare named import of
// it fails the whole module at load ("does not provide an export named 'setStaticStore'"), taking
// the storefront down over a version skew. Without it the store record still resolves —
// local-store-data.ts answers `/api/stores/public-details` from the same config.
;(medusa as { setStaticStore?: (fn: typeof staticStoreConfig) => void }).setStaticStore?.(staticStoreConfig)

// Local data first — countries, currencies, plugin toggles, the rest of the store record — then the
// net: nothing in Medusa mode may fall through to a Litekart REST path, because that API is neither
// installed nor running. See rest-guard.ts.
serveRestLocally(localStoreData)
blockRestFallbacks(medusa.BaseService, 'medusa')
