import { env } from '$env/dynamic/public'
// Static import, not `await import('kitcommerce.config')`: in the browser the dynamic form
// compiles to a raw fetch of /kitcommerce.config.ts that Vite dev doesn't serve as a module, so
// client init silently failed and setBaseUrl never ran (worked locally only because the default
// base URL matched). The config module is in the client bundle anyway via the services shim.
import { services } from 'kitcommerce.config'
import { staticStoreConfig } from './static-store'
import { localStoreData } from './local-store-data'
import { blockRestFallbacks } from './rest-guard'

// Loose view of whatever connector is active. The static type follows the installed package, so
// env-driven setup reads it through this shape instead. `connectorName` is the marker every
// connector carries — `active.ts` falls back to the name derived from the package specifier for
// connectors too old to export one — and it is what the env convention below is keyed on.
type ActiveServices = {
	connectorName?: string
	/** The connector's own BaseService class. Statics differ per connector; see APPLY_OVERRIDES. */
	BaseService?: {
		prototype: object
		/** The shared hook: most of these connectors take their whole config through it. */
		setCredentials?: (creds: Record<string, string>) => void
		/** Shopify's equivalent — positional, and keyed on a store domain rather than a URL. */
		setShopifyCredentials?: (storeDomain: string, accessToken: string, storefrontAccessToken?: string, proxyUrl?: string) => void
		[key: string]: unknown
	}
	storeService?: { setBaseUrl?: (url: string) => unknown }
	/** Connectors that can take this storefront's store record instead of asking a Litekart API. */
	setStaticStore?: (provider: typeof staticStoreConfig) => void
	/** Connectors that guard their own legacy REST paths and can consult local data first. */
	serveRestLocally?: (resolver: typeof localStoreData) => void
	/** The pre-rename name, still exported by connectors published before it. */
	serveLitekartRestLocally?: (resolver: typeof localStoreData) => void
}

const active = services as unknown as ActiveServices

// Registered here rather than per backend: every connector that accepts these gets them, and one
// that predates them is simply left alone. Store identity (name, logo, currency, menus, plugin
// toggles, theme variables) has no equivalent on any of these backends — it comes from
// default-store.json merged under the kitcommerce.config.ts default export. The resolver answers
// the handful of Litekart REST paths this storefront can serve from that same record. Litekart
// itself is unaffected: its connector reads neither.
active.setStaticStore?.(staticStoreConfig)
;(active.serveRestLocally ?? active.serveLitekartRestLocally)?.(localStoreData)

const read = (name: string) => env[name as `PUBLIC_${string}`] || undefined

// Litekart is the REST API the others merely inherit paths from. It is the one backend this file
// does not configure — its connector reads and validates its own trio — the one whose `/api/*`
// calls must never be intercepted, and the one whose env stays exempt from the foreign-env guard.
const LITEKART = 'litekart'

const LITEKART_ENV = ['PUBLIC_LITEKART_API_URL', 'PUBLIC_LITEKART_STORE_ID', 'PUBLIC_LITEKART_DOMAIN'] as const

/** What a deployment must set when the config names no connector we recognise. */
export const FALLBACK_REQUIRED_ENV: readonly string[] = LITEKART_ENV

// Two connectors are named for a package rather than the product, and their env follows the
// product. Everything else derives: `x-cart` → `PUBLIC_X_CART`, `commercetools` →
// `PUBLIC_COMMERCETOOLS`. A connector this repo has never heard of gets the derived form too, which
// is what lets it configure itself with no row to add here.
const ENV_PREFIX_OVERRIDES: Record<string, string> = {
	// The package is `oscar-connector`, but the env and docs say DJANGO_OSCAR — it is Django Oscar.
	oscar: 'PUBLIC_DJANGO_OSCAR',
	// Likewise `virto-connector`, against a product called Virto Commerce.
	virto: 'PUBLIC_VIRTO_COMMERCE'
}

/** `x-cart` → `PUBLIC_X_CART`. The prefix every variable this backend reads is spelled with. */
const envPrefix = (name: string) => ENV_PREFIX_OVERRIDES[name] ?? `PUBLIC_${name.replace(/-/g, '_').toUpperCase()}`

/** The env `/health` and `initActiveConnector` both check, for whichever backend is active. */
export const requiredEnvFor = (connectorName: string | undefined): readonly string[] => {
	if (!connectorName) return FALLBACK_REQUIRED_ENV
	if (connectorName === LITEKART) return LITEKART_ENV
	// Without a base URL a connector cannot reach its backend at all; `/health` reports 503.
	return [`${envPrefix(connectorName)}_API_URL`]
}

/**
 * Hands the connector every `<PREFIX>_*` variable that is actually set, camelCased.
 *
 * Reading the environment rather than a per-connector key list is what lets a backend this repo has
 * never seen configure itself: `PUBLIC_SPRYKER_ANONYMOUS_CUSTOMER_ID` arrives as
 * `anonymousCustomerId` without anything here knowing that Spryker has such a key, and a custom
 * connector's own credentials arrive on the same terms.
 *
 * Unset keys are dropped rather than passed as `undefined`: `setCredentials` merges
 * (`{ ...previous, ...creds }`), so an absent variable would otherwise erase a value the connector
 * already holds — including the `apiUrl` a previous call established.
 */
const credentialsFrom = (prefix: string) => {
	const creds: Record<string, string> = {}
	for (const [key, value] of Object.entries(env)) {
		if (!value || !key.startsWith(`${prefix}_`)) continue
		const camel = key
			.slice(prefix.length + 1)
			.toLowerCase()
			.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
		creds[camel] = value
	}
	return creds
}

// Four connectors predate the shared `setCredentials` hook and keep their own statics. Everything
// else — the ~21 template connectors, and any connector attached later — goes through the default
// in `applyFor` below.
const APPLY_OVERRIDES: Record<string, () => void> = {
	vendure: () => {
		// setBaseUrl writes the static shared by every service; the underlying `_baseUrl` is private.
		const url = read('PUBLIC_VENDURE_API_URL')
		if (url) active.storeService?.setBaseUrl?.(url)
	},
	medusa: () => {
		if (!active.BaseService) return
		active.BaseService.BASE_URL = read('PUBLIC_MEDUSA_API_URL')
		active.BaseService.PUBLISHABLE_KEY = read('PUBLIC_MEDUSA_PUBLISHABLE_API_KEY')
		active.BaseService.REGION_ID = read('PUBLIC_MEDUSA_REGION_ID')
	},
	saleor: () => {
		if (!active.BaseService) return
		active.BaseService.SALEOR_API_URL = read('PUBLIC_SALEOR_API_URL')
	},
	// Shopify is keyed on a store domain, not a URL, and takes its tokens positionally.
	shopify: () => {
		const url = read('PUBLIC_SHOPIFY_API_URL')
		if (!url) return
		// Accepts either form: `my-shop.myshopify.com` or `https://my-shop.myshopify.com`.
		const storeDomain = url.replace(/^https?:\/\//, '').replace(/\/+$/, '')
		active.BaseService?.setShopifyCredentials?.(
			storeDomain,
			read('PUBLIC_SHOPIFY_ACCESS_TOKEN') ?? '',
			read('PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN'),
			read('PUBLIC_SHOPIFY_PROXY_URL')
		)
	}
}

/** How this backend's env reaches it, or `undefined` for the one backend that configures itself. */
const applyFor = (name: string): (() => void) | undefined => {
	if (name === LITEKART) return undefined
	return APPLY_OVERRIDES[name] ?? (() => active.BaseService?.setCredentials?.(credentialsFrom(envPrefix(name))))
}

// Naming the fix matters: the usual cause is a deployment still carrying the previous backend's
// variables, which is what makes the environment and the installed connector disagree about which
// backend to run.
const wrongConnector = (envName: string, activeName: string | undefined) =>
	new Error(
		`${envName} is set, but it configures a different backend than the one this build runs on` +
			`${activeName ? ` (${activeName})` : ''} — remove it, or install that backend's connector ` +
			'(`bun add @misiki/<platform>-connector`, plus PUBLIC_CONNECTOR when more than one is installed).'
	)

// The mirror of wrongConnector. A connector reaches its backend only through the base URL applied
// below, and an unset env var used to be silent: nothing was configured, every call went to a
// relative path that the dev server answers with its own 404 page, and the storefront rendered
// "No products found" with nothing pointing at the cause. Fail at boot with the variable's name.
const missingEnv = (envName: string, connector: string) =>
	new Error(`the ${connector} connector is active but ${envName} is not set — add it to .env`)

const BACKEND_URL_ENV = /^PUBLIC_[A-Z0-9_]+_API_URL$/

// Every `PUBLIC_*_API_URL` doubles as a mode switch. One belonging to a backend other than the one
// installed is always a mistake, so say so rather than writing the value onto the wrong
// BaseService. Derived from the environment rather than from a list of known backends, so a custom
// connector's variables are guarded on the same terms as a shipped one's.
//
// `PUBLIC_LITEKART_API_URL` is exempt: `vite.config.ts` reads it to point the dev `/api` proxy
// somewhere, so it is routinely left set on a machine that also runs another backend, and it
// configures nothing here.
const guardForeignEnv = (activeName: string | undefined, activePrefix: string | undefined) => {
	for (const [key, value] of Object.entries(env)) {
		if (!value || !BACKEND_URL_ENV.test(key)) continue
		const prefix = key.slice(0, -'_API_URL'.length)
		if (prefix === activePrefix || prefix === 'PUBLIC_LITEKART') continue
		throw wrongConnector(key, activeName)
	}
}

// Shared by src/hooks.server.ts and src/hooks.client.ts: SSR and the browser both need the
// backend configured (in production the browser must reach the public API URL too).
export const initActiveConnector = async () => {
	const name = active.connectorName
	const apply = name ? applyFor(name) : undefined

	// Only for backends this file configures. Litekart's connector reads and validates its own
	// trio, and `/health` is what checks that one at deploy time.
	if (apply && name) {
		for (const key of requiredEnvFor(name)) {
			if (!read(key)) throw missingEnv(key, name)
		}
	}
	guardForeignEnv(name, name ? envPrefix(name) : undefined)

	apply?.()

	// The net under everything above: on any backend but Litekart there is no Litekart API to
	// answer the `/api/*` paths a connector may still inherit, so block them at the prototype
	// rather than let them fail late as a proxy ECONNREFUSED. Connectors published with their own
	// rest-guard already stop these one layer down; this covers the ones that aren't, and is a
	// no-op when it runs twice. See rest-guard.ts.
	if (name && name !== LITEKART && active.BaseService) blockRestFallbacks(active.BaseService, name)
}
