// import adapter from '@sveltejs/adapter-vercel'
import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: {
		postcss: true,
		preserve: ['ld+json']
	},
	kit: {
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
