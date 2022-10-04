import { sveltekit } from '@sveltejs/kit/vite'
const PUBLIC_HTTP_ENDPOINT = 'http://localhost:7000'
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
