import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
import { join } from 'path'
import { partytownVite } from '@builder.io/partytown/utils'
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const HTTP_ENDPOINT = env.PUBLIC_HTTP_ENDPOINT || 'https://api.litekart.in'
	return {
		plugins: [
			sveltekit()
			// partytownVite({
			// 	dest: join(process.cwd(), 'static', '~partytown')
			// })
		],
		server: {
			host: true,
			port: 3000,
			proxy: {
				'/api': HTTP_ENDPOINT
			}
		}
	}
})
