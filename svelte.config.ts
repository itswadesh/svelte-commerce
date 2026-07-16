import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'node:child_process'

// `version.name` is baked into BOTH the client and server bundles and is what SvelteKit derives its
// per-app `__sveltekit_<hash>` global from. The client and server are built in SEPARATE passes, so
// this MUST resolve to the SAME value in both passes. A date/time-based value does not — each pass
// can capture a different timestamp, so the client ends up reading a `__sveltekit_<hash>` global the
// server never defined, throwing "Cannot read properties of undefined (reading 'env')" on every page
// in production. Pinning it to the commit keeps it identical across passes AND stable for a given
// commit, so the client's redeploy check (the `updated` store, polled below) only fires on a real
// deploy. The fallback must never vary between passes.
function resolveVersion(): string {
	if (process.env.GIT_SHA) return process.env.GIT_SHA
	try {
		return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
			.toString()
			.trim()
	} catch {
		// No GIT_SHA and no .git (e.g. a Docker build that .dockerignores .git): use a STABLE constant.
		// A per-build unique value here would reintroduce the client/server mismatch; prefer passing
		// GIT_SHA as a build arg to restore per-deploy versioning.
		return 'app'
	}
}
const appVersion = resolveVersion()

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
