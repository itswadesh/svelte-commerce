import shell from 'shelljs'

shell.rm('-Rf', 'prod')
shell.mkdir('prod')
shell.cp('-R', '.svelte-kit', 'prod/svelte-kit')
shell.cp('-R', 'package.json', 'prod/package.json')
shell.cp('-R', 'static', 'prod/static')
