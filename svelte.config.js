import preprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'
import netlify from '@sveltejs/adapter-netlify'
import adapter from '@sveltejs/adapter-static'
import { HTTP_ENDPOINT } from './config'

const config = {
	kit: {
		target: '#svelte',
		adapter: netlify(),
		// adapter: adapter({
		// 	// default options are shown
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null,
		// }),
		vite: {
			server: {
				proxy: {
					'/api': HTTP_ENDPOINT,
				},
			},
			ssr: {
				noExternal: ['svelte-hero-icons'],
			},
		},
	},
}

export default config
