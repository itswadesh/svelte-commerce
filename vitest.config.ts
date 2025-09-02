import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

export default defineConfig({
	plugins: [svelte({ hot: false })],
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/test-setup.ts'],
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['node_modules', '.svelte-kit', 'src'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'.svelte-kit/',
				'src/app.html',
				'src/app.d.ts',
				'src/hooks.client.ts',
				'src/hooks.server.ts',
				'tests/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/generated/**'
			]
		}
	},
	resolve: {
		alias: {
			$lib: resolve('./src/lib'),
			$app: resolve('./src/app'),
			$env: resolve('./src/env')
		}
	}
})
