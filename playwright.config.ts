import type { PlaywrightTestConfig } from '@playwright/test'
import { port } from './tests/config'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port
	},
	testDir: 'tests',
	timeout: 10000,
	use: {
		ignoreHTTPSErrors: true
	}
}

export default config
