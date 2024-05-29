import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
// import { join } from 'path'
// import { partytownVite } from '@builder.io/partytown/utils'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import type { ProxyOptions } from 'vite'

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	// const HTTP_ENDPOINT = env.PUBLIC_LITEKART_API_URL || 'https://api.litekart.in'
	const HTTP_ENDPOINT = env.PUBLIC_HTTP_ENDPOINT


	const proxyConfig: ProxyOptions = {
		target: HTTP_ENDPOINT,
		headers: { PXM_USER: env.PUBLIC_PRODEXA_API_USER },
		secure: false,
		changeOrigin: true,
		cookiePathRewrite: '/pxc',
		configure: (proxy, _options) => {
			proxy.on('proxyRes', (proxyRes, req, res) => {
				delete proxyRes.headers['set-cookie']
			})
		}
	}

	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{ico,png,svg,webp}']
				},
				srcDir: './src',
				// mode: 'development',
				scope: '/',
				base: '/',
				devOptions: {
					// enabled: true,
					type: 'module',
					navigateFallback: '/'
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {}
			})
			// partytownVite({
			// 	dest: join(process.cwd(), 'static', '~partytown')
			// })
		],
		server: {
			host: true,
			port: 3000,
			proxy:
				HTTP_ENDPOINT === env.PUBLIC_PRODEXA_API_URL ? {
						'/api/': proxyConfig,
						'/prodexa-img/': {
							...proxyConfig,
							// replace `/prodexa-img/` with `/workarea/`
							rewrite: (path) => `${path.replace(/^\/prodexa-img\//, '/workarea/')}`
						},
						'/workarea-cdn/': {
							...proxyConfig,
							// replace `/workarea-cdn/fit-in/${w}x${h}/prodexa-img/` with `/workarea/`
							rewrite: (path) => `${path.replace(/^\/workarea-cdn\/fit-in\/(\d*)x(\d*)\/prodexa-img\//, '/workarea/')}`
						}
					} :
					{
						'/api': HTTP_ENDPOINT,
						'/sitemap': 'https://s3.ap-south-1.amazonaws.com/litekart.in'
					}
		}
	}
})
