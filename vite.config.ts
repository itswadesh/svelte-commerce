import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [sveltekit()],
		ssr: {
			noExternal: ['bits-ui']
		},
		//preview: { port: 80, strictPort: true, host: true },
		server: {
			allowedHosts: true, // This is required, else will "throw Blocked request. This host ("shopnx.in") is not allowed."
			host: true,
			port: 3000,
			proxy: {
				'/medusa': {
					target: env.PUBLIC_MEDUSA_API_URL || 'http://localhost:9000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/medusa/, '')
				},
				'/api': {
					target: env.PUBLIC_LITEKART_API_URL || 'http://localhost:7000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/api/, 'api') // Remove `/api` prefix
				},
				'/static': {
					target: env.PUBLIC_LITEKART_API_URL || 'http://localhost:7000', // Backend server URL
					changeOrigin: true, // Required for CORS
					secure: false, // Disable SSL verification if needed
					rewrite: (path) => path.replace(/^\/static/, 'static') // Remove `/static` prefix
				}
			}
		}
	}
})
