import preprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: {
			adapt() {
				node()
			},
		},
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
