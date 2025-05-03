import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [sveltekit(), svelteInspector()],
		preview: { port: 80, strictPort: true, host: true },
		server: {
			allowedHosts: true, // This is required, else will "throw Blocked request. This host ("shopnx.in") is not allowed."
			host: true,
			port: 3000,
			proxy: {
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
				},
				'/sitemaps': `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com`
			}
		}
	}
})
