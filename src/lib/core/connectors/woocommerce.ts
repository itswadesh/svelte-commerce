import * as woocommerce from '@misiki/woocommerce-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// WooCommerce-only connector. Everything the backend itself can answer for — catalogue, cart, checkout,
// auth, orders, addresses — and honest empty states for what WooCommerce has no equivalent of live in
// @misiki/woocommerce-connector (>= 0.4.1). What remains here is what only this storefront can answer.
export * from '@misiki/woocommerce-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_WOOCOMMERCE_* env, and names
// this backend's row in the CONNECTORS table in init.ts.
export const connectorName = 'woocommerce'

// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
// WooCommerce equivalent, so the connector reads it from here: default-store.json merged under the
// project's kitcommerce.config.ts default export. Registered at module load, before any service can
// ask for it.
// Optional on purpose: a connector older than 0.4.1 has no such hook, and a bare named import of
// it fails the whole module at load ("does not provide an export named 'setStaticStore'"), taking
// the storefront down over a version skew. Without it the store record still resolves —
// local-store-data.ts answers `/api/stores/public-details` from the same config.
;(woocommerce as { setStaticStore?: (fn: typeof staticStoreConfig) => void }).setStaticStore?.(staticStoreConfig)

// Local data first — countries, currencies, plugin toggles, the rest of the store record — then the
// net: nothing in WooCommerce mode may fall through to a Litekart REST path, because that API is neither
// installed nor running. See rest-guard.ts.
serveRestLocally(localStoreData)
blockRestFallbacks(woocommerce.BaseService, 'woocommerce')
