import houdini from 'houdini/preprocess'
import path from 'path'
import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			enabled: false
		},
		alias: {
			$houdini: path.resolve('.', '$houdini'),
			$graphql: path.resolve('src', 'lib', 'graphql')
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		}),
		houdini()
	]
}

export default config
