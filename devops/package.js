import shell from 'shelljs'
import packageInfo from '../package.json' assert { type: 'json' }

// Start Config
const FILE_NAMES =
	'package.json static .svelte-kit pm2.config.cjs svelte.config.js tsconfig.json vite.config.ts .env'
// End Config

// Zip to prepare file for deployment
shell
	.cd('prod')
	.exec(`tar czf ../${packageInfo.name}-${packageInfo.version}.tar.gz ${FILE_NAMES}`)
