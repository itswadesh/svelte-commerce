import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// Date-based build version, regenerated on every build (i.e. every push/deploy).
// SvelteKit writes this into `_app/version.json`; the client polls it and the
// `updated` store flips when a new build is live, so cached mobile/PWA clients
// can auto-refresh instead of running stale code. Displayed in the footer.
const pad = (n: number) => String(n).padStart(2, '0')
const now = new Date()
const appVersion = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getHours())}${pad(now.getMinutes())}`

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
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
