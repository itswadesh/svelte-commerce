import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import watchAndRun from '@kitql/vite-plugin-watch-and-run'
import { HTTP_ENDPOINT } from './src/lib/config/env.js'
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				watchAndRun([
					{
						watch: '**/*.(gql|graphql)',
						run: 'npm run gen'
					}
				])
			],
			server: {
				proxy: {
					'/graphql': HTTP_ENDPOINT,
					'/api': HTTP_ENDPOINT,
					'/images': HTTP_ENDPOINT
				}
			}
		}
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
}

export default config
