import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		protocol: 'http'
	},
	testDir: 'tests',
	timeout: 60000,
	use: {
		ignoreHTTPSErrors: true
	}
}

export default config
