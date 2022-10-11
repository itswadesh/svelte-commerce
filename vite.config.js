import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
// const PUBLIC_HTTP_ENDPOINT = 'https://staging.zapvi.in'
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [sveltekit()],
		server: {
			host: true,
			port: 3000,
			proxy: {
				'/api': env.PUBLIC_HTTP_ENDPOINT
			}
		}
	}
})
