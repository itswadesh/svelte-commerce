import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'node:child_process'

// `version.name` is baked into BOTH the client and server bundles and is what SvelteKit derives its
// per-app `__sveltekit_<hash>` global from. The client and server are built in SEPARATE passes, so
// this MUST resolve to the SAME value in both passes. A *wall-clock* timestamp (`new Date()` here)
// does NOT — each pass captures a different instant, so the client ends up reading a
// `__sveltekit_<hash>` global the server never defined, throwing "Cannot read properties of undefined
// (reading 'env')" on every page in production.
//
// So we still key it to the commit — but surface it as the commit's TIMESTAMP (shown in the footer)
// rather than its sha. The commit time is deterministic for a given commit, so it's identical across
// both passes AND changes on every real deploy (keeping the client's redeploy check — the `updated`
// store polled below — working). Docker builds that .dockerignore `.git` can't run git, so they pass
// a pre-rendered `BUILD_TIME` string instead (computed ONCE per build; see the Dockerfile).
function pad(n: number): string {
	return String(n).padStart(2, '0')
}
function formatUTC(epochSeconds: number): string {
	const d = new Date(epochSeconds * 1000)
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}
function resolveVersion(): string {
	// A `yyyy-mm-dd hh:mm:ss` string baked once per build (Docker path). Must be identical in both passes.
	if (process.env.BUILD_TIME) return process.env.BUILD_TIME
	try {
		// `%ct` = committer date as a unix timestamp — fixed for a commit, so both passes agree.
		const epoch = Number(execSync('git show -s --format=%ct HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim())
		if (Number.isFinite(epoch) && epoch > 0) return formatUTC(epoch)
	} catch {
		// fall through
	}
	// No BUILD_TIME and no .git: keep per-deploy version detection working with the sha if present,
	// else a STABLE constant. A per-build-unique value here would reintroduce the pass mismatch.
	return process.env.GIT_SHA || 'app'
}
const appVersion = resolveVersion()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			'kitcommerce.config': './kitcommerce.config.ts'
		},
		adapter: adapter(),
		// Inline route/layout CSS into the HTML instead of emitting render-blocking <link> tags.
		// On a production storefront running this theme, the layout stylesheet alone cost 950ms on
		// the FCP critical path (Lighthouse, Moto G Power / Slow 4G); inlining puts those bytes in a
		// document already in flight. Value is in UTF-16 code units, per stylesheet — anything
		// larger than this stays a linked file.
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
