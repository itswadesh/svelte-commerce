import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	timeout: 30 * 1000,
	expect: {
		timeout: 5000
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
	// Disable webServer to avoid permission issues
	// Instead, run the dev server manually before testing
	// webServer: {
	//   command: 'bun run dev',
	//   url: 'http://localhost:3000',
	//   reuseExistingServer: true,
	//   stderr: 'pipe',
	//   stdout: 'pipe',
	//   timeout: 120000,
	// },
})
