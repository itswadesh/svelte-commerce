import { sveltekit } from '@sveltejs/kit/vite'
const PUBLIC_HTTP_ENDPOINT = 'https://staging.zapvi.in'
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': PUBLIC_HTTP_ENDPOINT
		}
	}
}

export default config
