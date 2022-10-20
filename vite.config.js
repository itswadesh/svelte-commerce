import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const HTTP_ENDPOINT = env.PUBLIC_HTTP_ENDPOINT || 'https://api.litekart.in'
	return {
		plugins: [sveltekit()],
		server: {
			host: true,
			port: 3000,
			proxy: {
				'/api': HTTP_ENDPOINT
			}
		}
	}
})
