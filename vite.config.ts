import { createRequire } from 'node:module'
import { sveltekit } from '@sveltejs/kit/vite'
import { type Plugin, defineConfig, loadEnv } from 'vite'

const require = createRequire(import.meta.url)

const LITEKART_CONNECTOR = '@misiki/litekart-connector'
const CONNECTOR_NAME = /^@misiki\/[a-z0-9-]+-connector$/

// The backend connector is whichever @misiki/*-connector package.json installs; kitcommerce.config.ts
// exports it (directly, or via an override module in src/lib/core/connectors). Litekart is only the
// stock choice, so nothing may assume it is present. Finding no connector — or more than one — is
// not an error: the shim below simply does not apply, and resolution behaves exactly as it would
// without it.
const activeConnector = () => {
	const pkg = require('./package.json')
	const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((name) =>
		CONNECTOR_NAME.test(name)
	)
	return names.length === 1 ? names[0] : null
}

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
	const connector = activeConnector()
	return {
		plugins: [connectorPeerShim(connector), sveltekit()],
		resolve: {
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
