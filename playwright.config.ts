import type { PlaywrightTestConfig } from '@playwright/test'
import { port } from './tests/config'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm run preview',
		port,
		protocol: 'http'
	},
	testDir: 'tests',
	timeout: 10000,
	use: {
		ignoreHTTPSErrors: true
	}
}

export default config
