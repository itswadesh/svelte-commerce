import { createRequire } from 'node:module'
import { sveltekit } from '@sveltejs/kit/vite'
import { type Plugin, defineConfig, loadEnv } from 'vite'

const require = createRequire(import.meta.url)

const LITEKART_CONNECTOR = '@misiki/litekart-connector'
const CONNECTOR_NAME = /^@misiki\/[a-z0-9-]+-connector$/

// Every @misiki/*-connector this project installs.
const installedConnectors = () => {
	const pkg = require('./package.json')
	return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((name) => CONNECTOR_NAME.test(name))
}

/**
 * Which backend this build runs on — resolved once, here, and handed to the rest of the build as
 * the `$connector` alias. This is the whole backend switch: nothing under src/ names a connector
 * package, so attaching a different one never means editing this repo.
 *
 * `PUBLIC_CONNECTOR` wins when set. That is the escape hatch for a connector this repo has never
 * heard of (`@my-co/custom-connector`) and for a project that deliberately installs several.
 * Otherwise the single installed connector is it, and `bun add @misiki/shopify-connector` is the
 * entire migration.
 *
 * Failing here is deliberate. A specifier that resolves to a package nobody installed is what
 * produces `Rollup failed to resolve import "@misiki/…-connector"` minutes into a Docker build with
 * nothing naming the cause. These messages name it before the build starts.
 */
const activeConnector = (override?: string) => {
	if (override) return override
	const installed = installedConnectors()
	if (installed.length === 1) return installed[0]
	if (installed.length === 0) {
		throw new Error(
			'No commerce connector is installed. Add the backend this storefront runs on — e.g. ' +
				'`bun add @misiki/shopify-connector` — or set PUBLIC_CONNECTOR to the package to use.'
		)
	}
	// Several are installed. Litekart is the documented stock choice, so prefer it over guessing.
	if (installed.includes(LITEKART_CONNECTOR)) return LITEKART_CONNECTOR
	throw new Error(
		`Several commerce connectors are installed (${installed.join(', ')}) and none is the stock ` +
			'Litekart one, so which to run on is ambiguous. Set PUBLIC_CONNECTOR to pick one.'
	)
}

/** `@misiki/x-cart-connector` → `x-cart`: the short name the env convention and rest-guard key on. */
const connectorShortName = (specifier: string) => specifier.replace(/^@[^/]+\//, '').replace(/-connector$/, '')

// @misiki/kitcommerce-core declares @misiki/litekart-connector as a peerDependency and imports it by
// name in dist/composables/my-reviews-renderer.svelte, which the $lib/core/composables barrel pulls
// into every build. On a storefront that swapped connectors that package isn't installed, so Rollup
// fails to resolve it and the build dies on a backend the store doesn't even use. Every @misiki
// connector is a fork exposing the same service surface, so point that one specifier at the
// installed connector. Scoped to importers inside kitcommerce-core: a literal
// '@misiki/litekart-connector' written in this repo keeps meaning exactly what it says.
const connectorPeerShim = (connector: string | null): Plugin => ({
	name: 'connector-peer-shim',
	enforce: 'pre',
	async resolveId(source, importer, options) {
		if (!connector || connector === LITEKART_CONNECTOR) return null
		if (source !== LITEKART_CONNECTOR || !importer) return null
		if (!/[\\/]@misiki[\\/]kitcommerce-core[\\/]/.test(importer)) return null
		// The SSR build externalises connector packages, so hand back the bare specifier and keep it
		// external — resolving it to a file path here makes Rollup treat the same package as internal
		// in one place and external in another ("resolved as a module now, but it was an external
		// module before"). The client build bundles it, so resolve it properly there.
		if (options?.ssr) return { id: connector, external: true }
		const resolved = await this.resolve(connector, importer, { ...options, skipSelf: true })
		return resolved?.id ?? null
	}
})

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const connector = activeConnector(env.PUBLIC_CONNECTOR)
	return {
		plugins: [connectorPeerShim(connector), sveltekit()],
		// The one place a connector package is named. `$connector` is what src/lib/core/connectors/
		// active.ts imports, and `__CONNECTOR_NAME__` is the fallback short name for connectors old
		// enough not to export a `connectorName` marker of their own (Litekart 2.0.x is one).
		define: {
			__CONNECTOR_NAME__: JSON.stringify(connectorShortName(connector))
		},
		resolve: {
			alias: [{ find: /^\$connector$/, replacement: connector }],
			// @misiki/kitcommerce-core ships its own nested copy of svelte-sonner, so its components
			// (the address form renderer, the cart store, …) called `toast()` on a different module
			// instance from the `<Toaster />` mounted in src/routes/+layout.svelte. Every error routed
			// through a toast — a rejected address field, a failed save — silently rendered nowhere,
			// which is what made Save Address look dead. One instance, one toast store.
			dedupe: ['svelte-sonner']
		},
		ssr: {
			noExternal: ['bits-ui']
		},
		//preview: { port: 80, strictPort: true, host: true },
		server: {
			allowedHosts: true, // This is required, else will "throw Blocked request. This host ("shopnx.in") is not allowed."
			host: true,
			port: 3000,
			proxy: {
				'/medusa': {
					target: env.PUBLIC_MEDUSA_API_URL || 'http://localhost:9000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/medusa/, '')
				},
				'/api': {
					target: env.PUBLIC_LITEKART_API_URL || 'http://localhost:7000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/api/, 'api') // Remove `/api` prefix
				},
				'/static': {
					target: env.PUBLIC_LITEKART_API_URL || 'http://localhost:7000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/static/, 'static') // Remove `/static` prefix
				}
			}
		}
	}
})
