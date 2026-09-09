import * as connector from '$connector'
import { staticStoreConfig } from './static-store'
import { blockRestFallbacks, serveRestLocally } from './rest-guard'
import { localStoreData } from './local-store-data'

// The active backend, whichever connector package this project installs.
//
// This one module replaces the 26 near-identical per-backend files that used to live beside it —
// bagisto.ts, magento.ts, shopware.ts and the rest were the same 29 lines with a different platform
// name substituted in, so attaching a 27th backend meant hand-copying them a 27th time. The package
// is resolved by the `$connector` alias in vite.config.ts, which is the only place in the project
// that names one. Attaching a different backend is `bun add @misiki/<platform>-connector`; nothing
// in this repo changes.
export * from '$connector'

// Everything below reaches for hooks through casts on purpose. Which of them a connector exposes
// varies by package version — Litekart 2.0.x exports none of them — and a bare named import of one
// that is absent fails the whole module at load ("does not provide an export named
// 'setStaticStore'"), taking the storefront down over a version skew.
type ConnectorHooks = {
	connectorName?: string
	BaseService?: { prototype: object; [key: string]: unknown }
	setStaticStore?: (provider: typeof staticStoreConfig) => void
}

const hooks = connector as ConnectorHooks

/**
 * Names this backend for `init.ts` (which env it requires, how that env reaches it) and for
 * `rest-guard.ts`.
 *
 * Newer connectors export the marker themselves, which is what lets a connector this repo has never
 * heard of identify itself correctly. Older ones do not, so fall back to the name derived from the
 * package specifier at build time — `@misiki/x-cart-connector` → `x-cart`, the same string the
 * hand-written module used to hard-code.
 */
export const connectorName: string = hooks.connectorName || __CONNECTOR_NAME__

// Litekart is the REST API every other connector merely inherits paths from, so it is the one
// backend where `/api/*` is real and must not be intercepted, and the one that serves store
// identity live rather than from local config. Keyed on the name rather than the package so a fork
// or a private republish of that connector behaves the same way.
const OWNS_LITEKART_REST = connectorName === 'litekart'

if (!OWNS_LITEKART_REST) {
	// Store identity — name, logo, favicon, currency, menus, plugin toggles, theme variables — has no
	// equivalent on these backends, so the connector reads it from here: default-store.json merged
	// under the project's kitcommerce.config.ts default export. Registered at module load, before any
	// service can ask for it. `init.ts` registers the same provider again at boot; it is idempotent.
	hooks.setStaticStore?.(staticStoreConfig)

	// Local data first — countries, currencies, plugin toggles, the rest of the store record — then
	// the net: nothing outside Litekart mode may fall through to a Litekart REST path, because that
	// API is neither installed nor running. See rest-guard.ts.
	serveRestLocally(localStoreData)
	if (hooks.BaseService) blockRestFallbacks(hooks.BaseService, connectorName)
}
