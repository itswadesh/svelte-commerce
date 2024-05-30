import shell from 'shelljs'
// const shell = require('shelljs')

shell.rm('-Rf', 'prod')
shell.mkdir('prod')
shell.cp('-R', 'package.json', 'prod/package.json')
shell.cp('-R', '.svelte-kit', 'prod/.svelte-kit')
shell.cp('-R', 'static', 'prod/static')
shell.cp('-R', 'svelte.config.js', 'prod/svelte.config.js')
shell.cp('-R', 'tsconfig.json', 'prod/tsconfig.json')
// shell.cp('-R', 'vite.config.js', 'prod/vite.config.js')
shell.cp('-R', 'vite.config.ts', 'prod/vite.config.ts')
shell.cp('-R', 'devops/pm2.config.cjs', 'prod/pm2.config.cjs')
shell.cp('-R', '.env.prodexa.example', 'prod/.env')

