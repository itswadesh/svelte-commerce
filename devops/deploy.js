import shell from 'shelljs'
import SSH2Shell from 'ssh2shell'
import fs from 'fs'

// Start Config
const PM2_NAME = 'litekart-www:3000'
const REMOTE_DIR = '/var/www/litekart/www'
const REMOTE_HOST = '65.20.67.103'
const REMOTE_USER = 'root'
const PRIVATE_KEY = 'D:/ssh/node-server.pem'
const FILE_NAMES =
	'package.json static .svelte-kit pm2.config.js svelte.config.js tsconfig.json vite.config.js'

// End Config

// Zip and send file to remote server
shell
	.cd('prod')
	.exec('tar czf arialshop.tar.gz ' + FILE_NAMES)
	.exec(
		'scp -i ' +
			PRIVATE_KEY +
			' arialshop.tar.gz ' +
			REMOTE_USER +
			'@' +
			REMOTE_HOST +
			':' +
			REMOTE_DIR
	)
shell.rm('arialshop.tar.gz')

// Extract and reload pm2
const host = {
	server: {
		host: REMOTE_HOST,
		port: 22,
		userName: REMOTE_USER,
		privateKey: fs.readFileSync(PRIVATE_KEY)
	},
	commands: [
		'sudo mkdir -p ' + REMOTE_DIR,
		'cd ' + REMOTE_DIR,
		'sudo tar xf arialshop.tar.gz -C ' + REMOTE_DIR,
		'sudo rm arialshop.tar.gz',
		'sudo npm install --production --force',
		`sudo pm2 start pm2.config.js`,
		'sudo pm2 reload ' + PM2_NAME
	]
}

const SSH = new SSH2Shell(host)
// Use a callback function to process the full session text
const callback = function (sessionText) {
	// console.log(sessionText)
}

// Start the process
SSH.connect(callback)
