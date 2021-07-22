import preprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'
import netlify from '@sveltejs/adapter-netlify'
import adapter from '@sveltejs/adapter-static'

const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
		}),
		vite: {
			server: {
				proxy: {
					'/api': 'https://api.litekart.in',
				},
			},
			ssr: {
				noExternal: ['svelte-hero-icons'],
			},
		},
	},
}

export default config
