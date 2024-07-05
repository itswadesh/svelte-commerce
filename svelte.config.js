// import adapter from '@sveltejs/adapter-vercel'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
			preserve: ['ld+json']
		})
	],
	kit: {
		alias: {
			'lib/*': 'src/lib/*'
		},
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		}
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'meta-shift',
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right'
		}
	}
}

export default config
