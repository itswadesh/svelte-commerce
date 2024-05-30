import shell from 'shelljs'
import packageInfo from '../package.json' assert { type: 'json' }

// Start Config
const PM2_NAME = 'prodexa-pxc-storefront-www:3000'
const REMOTE_DIR = 'prod-run'

// End Config

// Extract and reload pm2
shell.mkdir('-p', REMOTE_DIR)
shell.exec(`tar xf ${packageInfo.name}-${packageInfo.version}.tar.gz -C` + REMOTE_DIR)
shell.cd(REMOTE_DIR)
shell.exec('npm install')
shell.exec('pm2 start pm2.config.cjs')
shell.exec('pm2 reload' + PM2_NAME)
