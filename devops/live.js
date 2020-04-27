const shell = require('shelljs')
require('dotenv').config()

// Start Config
const PM2_NAME = 'h'
const REMOTE_DIR = '/var/www/hopyshopy/www'
const REMOTE_host = '139.59.42.129'
const REMOTE_USER = 'root'
const PRIVATE_KEY = process.env.LIVE_KEY
const FILE_NAMES = '__sapper__ package.json static'
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
      REMOTE_host +
      ':' +
      REMOTE_DIR
  )
shell.rm('arialshop.tar.gz')

// Extract and reload pm2
var host = {
  server: {
    host: REMOTE_host,
    port: 22,
    userName: REMOTE_USER,
    privateKey: require('fs').readFileSync(PRIVATE_KEY),
  },
  commands: [
    'cd ' + REMOTE_DIR,
    'sudo tar xf arialshop.tar.gz -C ' + REMOTE_DIR,
    'sudo rm arialshop.tar.gz',
    'sudo npm install --prod',
    'sudo pm2 reload ' + PM2_NAME,
  ],
}

var SSH2Shell = require('ssh2shell'),
  //Create a new instance passing in the host object
  SSH = new SSH2Shell(host),
  //Use a callback function to process the full session text
  callback = function (sessionText) {
    console.log(sessionText)
  }

//Start the process
SSH.connect(callback)
