import { BaseService, clearPhantomSessionIfUnavailable, meilisearchService as connectorSearch, setStaticStore } from '@misiki/gocommerce-connector'
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

// The shared search components ask for `{ query }` — the storefront's neutral spelling, and what
// Litekart's own service reads. GoCommerce's connector reads `params.q` and defaults it to '', so
// the typed term was dropped on the floor and every keystroke returned the same first page of the
// catalogue: "mug", "tee" and "zzzqqq" all produced an identical list of confident-looking
// suggestions. Translating one backend's parameter spelling belongs here, in the adapter, and not
// in a nav component that has to work against 26 backends.
//
// Patched on the singleton at module load, the same way `blockRestFallbacks` patches BaseService
// below, and for the same reason: re-exporting a wrapped copy from this module does not reach the
// call sites. `@misiki/kitcommerce-core/services` ships pre-built and reads its services off the
// namespace of `kitcommerce.config`, so a local `export const` here never displaces the one that
// arrives via `export *`. The instance is a shared singleton, so patching it is what every
// consumer sees, whichever path resolved it.
type AutoCompleteParams = { q?: string; query?: string; limit?: number }

const forwardAutoComplete = connectorSearch.searchAutoComplete.bind(connectorSearch)
connectorSearch.searchAutoComplete = (params: AutoCompleteParams = {}) => forwardAutoComplete({ ...params, q: params.q ?? params.query ?? '' })

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
