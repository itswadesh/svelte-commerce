import type { PlaywrightTestConfig } from '@playwright/test'
import { port } from './tests/ui/config'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run preview',
		port,
	},
	testDir: 'tests',
	timeout: 150000,
	use: {
		ignoreHTTPSErrors: true
	}
}

export default config
