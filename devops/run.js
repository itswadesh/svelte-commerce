import shell from 'shelljs'

// Start Config
const PM2_NAME = 'prodexa-pxc-storefront-www:3000'
// End Config

// run using pm2
shell.cd('prod')
shell.exec('npm install')
shell.exec('pm2 start pm2.config.cjs')
shell.exec('pm2 reload' + PM2_NAME)
