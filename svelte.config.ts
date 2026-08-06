import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// Date-based build version, regenerated on every build (i.e. every push/deploy).
// SvelteKit writes this into `_app/version.json`; the client polls it and the
// `updated` store flips when a new build is live, so cached mobile/PWA clients
// can auto-refresh instead of running stale code. Displayed in the footer.
const appVersion = 'varni-storefronts'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		// Inline route/layout CSS into the HTML instead of emitting render-blocking <link> tags.
		// Measured on a production storefront: the layout stylesheet alone cost 950ms on the FCP
		// critical path (Lighthouse, Moto G Power / Slow 4G). Inlining puts those bytes in a
		// document already in flight. UTF-16 code units, per stylesheet; larger ones stay linked.
		inlineStyleThreshold: 262144,
		csrf: {
			trustedOrigins: ['*']
		},
		version: {
			name: appVersion,
			// Poll _app/version.json every 60s so a new deploy is detected quickly.
			pollInterval: 60_000
		}
	}
}

export default config
