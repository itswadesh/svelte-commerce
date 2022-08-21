import watchAndRun from '@kitql/vite-plugin-watch-and-run'
import { sveltekit } from '@sveltejs/kit/vite'
import { HTTP_ENDPOINT } from './src/lib/config/env.js'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		watchAndRun([
			{
				watch: '**/*.(gql|graphql)',
				run: 'npm run gen'
			}
		])
	],
	server: {
		fs: {
			allow: ['.']
		},
		proxy: {
			'/graphql': HTTP_ENDPOINT,
			'/api': HTTP_ENDPOINT,
			'/images': HTTP_ENDPOINT
		}
	}
}

export default config
