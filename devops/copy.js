import shell from 'shelljs'

shell.rm('-Rf', 'prod')
shell.mkdir('prod')
shell.cp('-R', 'package.json', 'prod/package.json')
shell.cp('-R', '.svelte-kit', 'prod/.svelte-kit')
shell.cp('-R', 'static', 'prod/static')
shell.cp('-R', 'svelte.config.js', 'prod/svelte.config.js')
shell.cp('-R', 'tsconfig.json', 'prod/tsconfig.json')
shell.cp('-R', 'vite.config.js', 'prod/vite.config.js')
shell.cp('-R', 'devops/pm2.config.js', 'prod/pm2.config.js')
