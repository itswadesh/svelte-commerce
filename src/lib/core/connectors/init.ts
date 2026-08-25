import { env } from '$env/dynamic/public'
// Static import, not `await import('kitcommerce.config')`: in the browser the dynamic form
// compiles to a raw fetch of /kitcommerce.config.ts that Vite dev doesn't serve as a module, so
// client init silently failed and setBaseUrl never ran (worked locally only because the default
// base URL matched). The config module is in the client bundle anyway via the services shim.
import { services } from 'kitcommerce.config'
import { staticStoreConfig } from './static-store'
import { localStoreData } from './local-store-data'
import { blockRestFallbacks } from './rest-guard'

// Loose view of whatever connector kitcommerce.config.ts exports. The static type follows the
// active connector, so env-driven setup reads it through this shape instead. `connectorName` is
// the marker every connector package exports — it names the row in CONNECTORS below, and lets init
// fail loudly when a PUBLIC_<CONNECTOR>_* env is set while a different connector is active instead
// of silently writing that connector's statics onto the wrong BaseService.
type ActiveServices = {
	connectorName?: string
	/** The connector's own BaseService class. Statics differ per connector; see CONNECTORS. */
	BaseService?: {
		prototype: object
		/** The shared hook: 21 of these connectors take their whole config through it. */
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

// `PUBLIC_BAGISTO_API_URL` from `apiUrl`, `PUBLIC_SPRYKER_ANONYMOUS_CUSTOMER_ID` from
// `anonymousCustomerId` — the connectors' credential keys are camelCase, the env vars are the same
// words in SCREAMING_SNAKE.
const envName = (prefix: string, key: string) => `${prefix}_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`

// Every one of the 21 template connectors declares this same core in its `Credentials` (src/config.ts);
// the per-connector extras are listed alongside each row below.
const SHARED_CREDENTIALS = ['apiUrl', 'apiKey', 'apiSecret', 'accessToken', 'accessKey', 'storeId', 'channelId']

/**
 * Reads `<prefix>_<KEY>` for each credential the connector accepts and hands over the ones that are
 * actually set.
 *
 * Unset keys are dropped rather than passed as `undefined`: `setCredentials` merges
 * (`{ ...previous, ...creds }`), so an absent env var would otherwise erase a value the connector
 * already holds — including the `apiUrl` a previous call established.
 */
const credentials =
	(prefix: string, extras: string[] = []) =>
	() => {
		const creds: Record<string, string> = {}
		for (const key of [...SHARED_CREDENTIALS, ...extras]) {
			const value = read(envName(prefix, key))
			if (value) creds[key] = value
		}
		active.BaseService?.setCredentials?.(creds)
	}

type Backend = {
	/** Without these the connector cannot reach its backend at all; `/health` reports 503. */
	required: readonly string[]
	/** Hands the PUBLIC_ env over to whatever this connector exposes for it. */
	apply?: () => void
	/**
	 * The module under this directory that `kitcommerce.config.ts` names to select this backend.
	 * Every backend has one, so the switch is always one path under src/lib/core/connectors and
	 * never a connector package by name — which is what keeps app code free of both.
	 */
	module?: string
}

// One row per backend this storefront can run on. It is the single source of truth for three
// things that used to be spelled out separately per connector: which env a deployment must set,
// how that env reaches the connector, and (via `/health`) what a readiness probe checks.
//
// Adding a backend is one row here plus its module next to this file. The connector package
// supplies the rest — `connectorName`, `setStaticStore`, `serveRestLocally`.
export const CONNECTORS: Record<string, Backend> = {
	// Litekart is the REST API the others merely inherit paths from, so it takes no base URL here:
	// its connector reads the trio itself, and its `/api/*` calls must never be intercepted.
	litekart: {
		required: ['PUBLIC_LITEKART_API_URL', 'PUBLIC_LITEKART_STORE_ID', 'PUBLIC_LITEKART_DOMAIN'],
		module: 'litekart'
	},

	// Three connectors predate the shared `setCredentials` hook and keep their own statics.
	vendure: {
		required: ['PUBLIC_VENDURE_API_URL'],
		module: 'vendure',
		apply: () => {
			// setBaseUrl writes the static shared by every service; the underlying `_baseUrl` is private.
			const url = read('PUBLIC_VENDURE_API_URL')
			if (url) active.storeService?.setBaseUrl?.(url)
		}
	},
	medusa: {
		required: ['PUBLIC_MEDUSA_API_URL'],
		module: 'medusa',
		apply: () => {
			if (!active.BaseService) return
			active.BaseService.BASE_URL = read('PUBLIC_MEDUSA_API_URL')
			active.BaseService.PUBLISHABLE_KEY = read('PUBLIC_MEDUSA_PUBLISHABLE_API_KEY')
			active.BaseService.REGION_ID = read('PUBLIC_MEDUSA_REGION_ID')
		}
	},
	saleor: {
		required: ['PUBLIC_SALEOR_API_URL'],
		module: 'saleor',
		apply: () => {
			if (!active.BaseService) return
			active.BaseService.SALEOR_API_URL = read('PUBLIC_SALEOR_API_URL')
		}
	},
	// Shopify is keyed on a store domain, not a URL, and takes its tokens positionally.
	shopify: {
		required: ['PUBLIC_SHOPIFY_API_URL'],
		module: 'shopify',
		apply: () => {
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
	},

	// The rest share `BaseService.setCredentials`. The second argument lists the extra keys that
	// connector's own `Credentials` adds beyond SHARED_CREDENTIALS.
	bagisto: { required: ['PUBLIC_BAGISTO_API_URL'], module: 'bagisto', apply: credentials('PUBLIC_BAGISTO', ['locale', 'currency']) },
	broadleaf: { required: ['PUBLIC_BROADLEAF_API_URL'], module: 'broadleaf', apply: credentials('PUBLIC_BROADLEAF') },
	commercetools: {
		required: ['PUBLIC_COMMERCETOOLS_API_URL'],
		module: 'commercetools',
		apply: credentials('PUBLIC_COMMERCETOOLS', ['region', 'projectKey', 'authUrl', 'scope', 'locale', 'currency', 'country'])
	},
	'cs-cart': { required: ['PUBLIC_CS_CART_API_URL'], module: 'cs-cart', apply: credentials('PUBLIC_CS_CART') },
	evershop: { required: ['PUBLIC_EVERSHOP_API_URL'], module: 'evershop', apply: credentials('PUBLIC_EVERSHOP') },
	magento: { required: ['PUBLIC_MAGENTO_API_URL'], module: 'magento', apply: credentials('PUBLIC_MAGENTO') },
	nopcommerce: { required: ['PUBLIC_NOPCOMMERCE_API_URL'], module: 'nopcommerce', apply: credentials('PUBLIC_NOPCOMMERCE') },
	opencart: { required: ['PUBLIC_OPENCART_API_URL'], module: 'opencart', apply: credentials('PUBLIC_OPENCART') },
	orocommerce: {
		required: ['PUBLIC_OROCOMMERCE_API_URL'],
		module: 'orocommerce',
		apply: credentials('PUBLIC_OROCOMMERCE', ['localizationId', 'currency', 'productIdMode'])
	},
	// The package is `oscar-connector`, but the env and docs say DJANGO_OSCAR — it is Django Oscar.
	oscar: { required: ['PUBLIC_DJANGO_OSCAR_API_URL'], module: 'oscar', apply: credentials('PUBLIC_DJANGO_OSCAR') },
	prestashop: {
		required: ['PUBLIC_PRESTASHOP_API_URL'],
		module: 'prestashop',
		apply: credentials('PUBLIC_PRESTASHOP', ['languageId', 'shopId', 'shopGroupId'])
	},
	sharetribe: {
		required: ['PUBLIC_SHARETRIBE_API_URL'],
		module: 'sharetribe',
		apply: credentials('PUBLIC_SHARETRIBE', ['clientId', 'assetUrl'])
	},
	shopware: { required: ['PUBLIC_SHOPWARE_API_URL'], module: 'shopware', apply: credentials('PUBLIC_SHOPWARE') },
	shuup: { required: ['PUBLIC_SHUUP_API_URL'], module: 'shuup', apply: credentials('PUBLIC_SHUUP') },
	spree: { required: ['PUBLIC_SPREE_API_URL'], module: 'spree', apply: credentials('PUBLIC_SPREE') },
	spryker: {
		required: ['PUBLIC_SPRYKER_API_URL'],
		module: 'spryker',
		apply: credentials('PUBLIC_SPRYKER', ['locale', 'anonymousCustomerId', 'navigationKey'])
	},
	swell: { required: ['PUBLIC_SWELL_API_URL'], module: 'swell', apply: credentials('PUBLIC_SWELL') },
	sylius: { required: ['PUBLIC_SYLIUS_API_URL'], module: 'sylius', apply: credentials('PUBLIC_SYLIUS', ['localeCode']) },
	virto: {
		required: ['PUBLIC_VIRTO_COMMERCE_API_URL'],
		module: 'virto',
		apply: credentials('PUBLIC_VIRTO_COMMERCE', ['cultureName', 'currencyCode', 'catalogId'])
	},
	woocommerce: { required: ['PUBLIC_WOOCOMMERCE_API_URL'], module: 'woocommerce', apply: credentials('PUBLIC_WOOCOMMERCE') },
	'x-cart': { required: ['PUBLIC_X_CART_API_URL'], module: 'x-cart', apply: credentials('PUBLIC_X_CART') }
}

/** What a deployment must set when the config names no connector we recognise. */
export const FALLBACK_REQUIRED_ENV = CONNECTORS.litekart.required

/** The env `/health` and `initActiveConnector` both check, for whichever backend is active. */
export const requiredEnvFor = (connectorName: string | undefined) => (connectorName && CONNECTORS[connectorName]?.required) || FALLBACK_REQUIRED_ENV

// Naming the fix matters: the usual cause is a config that still names another backend, which is
// what carries the `connectorName` marker this check reads — see docs/<CONNECTOR>.md, step 2.
const wrongConnector = (envName: string, connector: string) => {
	const target = CONNECTORS[connector]?.module
	return new Error(
		`${envName} is set but the ${connector} connector is not active in kitcommerce.config.ts — ` +
			(target ? `point it at './src/lib/core/connectors/${target}'` : `point it at '@misiki/${connector}-connector'`)
	)
}

// The mirror of wrongConnector. A connector reaches its backend only through the base URL applied
// below, and an unset env var used to be silent: nothing was configured, every call went to a
// relative path that the dev server answers with its own 404 page, and the storefront rendered
// "No products found" with nothing pointing at the cause. Fail at boot with the variable's name.
const missingEnv = (envName: string, connector: string) =>
	new Error(`the ${connector} connector is active in kitcommerce.config.ts but ${envName} is not set — add it to .env`)

// Every `PUBLIC_*_API_URL` doubles as a mode switch. Setting one while another connector is active
// is always a mistake — it means the config and the .env disagree about which backend to run — so
// say which of the two to change rather than writing the value onto the wrong BaseService.
//
// `PUBLIC_LITEKART_API_URL` is exempt: `vite.config.ts` reads it to point the dev `/api` proxy
// somewhere, so it is routinely left set on a machine that also runs another backend, and it
// configures nothing here.
const guardForeignEnv = (activeName: string | undefined) => {
	for (const [name, backend] of Object.entries(CONNECTORS)) {
		if (name === activeName || name === 'litekart') continue
		const url = backend.required.find((key) => key.endsWith('_API_URL'))
		if (url && read(url)) throw wrongConnector(url, name)
	}
}

// Shared by src/hooks.server.ts and src/hooks.client.ts: SSR and the browser both need the
// backend configured (in production the browser must reach the public API URL too).
export const initActiveConnector = async () => {
	const name = active.connectorName
	const backend = name ? CONNECTORS[name] : undefined

	// Only for backends this file configures. Litekart's connector reads and validates its own
	// trio, and `/health` is what checks that one at deploy time.
	if (backend?.apply) {
		for (const key of backend.required) {
			if (!read(key)) throw missingEnv(key, name as string)
		}
	}
	guardForeignEnv(name)

	backend?.apply?.()

	// The net under everything above: on any backend but Litekart there is no Litekart API to
	// answer the `/api/*` paths a connector may still inherit, so block them at the prototype
	// rather than let them fail late as a proxy ECONNREFUSED. Connectors published with their own
	// rest-guard already stop these one layer down; this covers the ones that aren't, and is a
	// no-op when it runs twice. See rest-guard.ts.
	if (name && name !== 'litekart' && active.BaseService) blockRestFallbacks(active.BaseService, name)
}
