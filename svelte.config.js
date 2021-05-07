import preprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			defaults: {
				style: 'postcss',
			},
			postcss: true,
		}),
	],
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		// adapter: vercel(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
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
			//   alias: {
			//     tslib: 'tslib/tslib.es6.js',
			//   },
		},
	},
}

export default config
