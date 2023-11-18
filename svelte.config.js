// import adapter from '@sveltejs/adapter-vercel'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import * as child_process from 'node:child_process'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
			preserve: ['ld+json']
		})
	],
	kit: {
		adapter: adapter(),
		version: {
			name: child_process.execSync('git rev-parse HEAD').toString().trim()
		},
		csrf: {
			checkOrigin: false
		}
	}
	// vitePlugin: {
	// 	experimental: {
	// 		inspector: true
	// 	}
	// }
}

export default config
