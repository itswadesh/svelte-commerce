import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { resolve } from 'node:path'

export default defineConfig({
	// svelteTesting resolves Svelte's browser build, so a component can mount under jsdom.
	plugins: [svelte({ hot: false }), svelteTesting()],
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
			$env: resolve('./src/env'),
			// The connector namespace (svelte.config.js aliases the real one for the app).
			'kitcommerce.config': resolve('./tests/stubs/kitcommerce-config.ts')
		}
	}
})
