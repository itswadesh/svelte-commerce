import { BaseService, clearPhantomSessionIfUnavailable, setStaticStore } from '@misiki/gocommerce-connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// GoCommerce-only connector. Everything the backend can answer for — catalogue, cart, guest
// checkout, orders, and shopper accounts when the store installs the `identity` module — and honest
// empty states for what GoCommerce deliberately does not have live in @misiki/gocommerce-connector
// (>= 0.2.0), written against the server's own OpenAPI document. What remains in this file is what
// only the storefront can answer.
export * from '@misiki/gocommerce-connector'

// Lets the hooks `init` verify the selected connector matches the PUBLIC_GOCOMMERCE_* env.
export const connectorName = 'gocommerce'

// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
// GoCommerce equivalent, so the connector reads it from here: default-store.json merged under the
// project's kitcommerce.config.ts default export. Registered at module load, before any service can
// ask for it.
//
// The toggles for features GoCommerce cannot perform are forced off when the record is read, not
// here — `init.ts` re-registers this provider at boot for whatever connector is active, so anything
// wrapped around it at module load is replaced. See `IMPOSSIBLE_FEATURES` in the connector's
// static-store module. `accounts` is forced off only when the store has no identity module.
setStaticStore(staticStoreConfig)

// Local data first — countries, currencies, plugin toggles, the rest of the store record — then the
// net: nothing in GoCommerce mode may fall through to a Litekart REST path, because that API is
// neither installed nor running. GoCommerce's own endpoints also live under `/api/`, which is why
// the connector's services address them absolutely (see the connector's `BaseService.api`) and are
// not touched by the guard. See rest-guard.ts.
serveRestLocally(localStoreData)
blockRestFallbacks(BaseService, 'gocommerce')

// On a store without the identity module, `connect.sid` / `me` in this browser can only be left over
// from running this storefront against a backend that has accounts. The shared user store reads
// those cookies directly to decide who is signed in, and believing it here is not a cosmetic
// problem: it makes the checkout take the saved-address path instead of the guest one, against a
// store that has no address book. With the module installed the pair is a real session and stays.
// The connector asks the store which it is (one probe, remembered) and drops them only if it must.
void clearPhantomSessionIfUnavailable()
