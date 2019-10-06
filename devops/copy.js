const shell = require('shelljs');

shell.rm('-Rf', 'prod');
shell.mkdir('prod');
shell.cp('-R', '__sapper__', 'prod/__sapper__');
shell.cp('-R', 'package.json', 'prod/package.json');
shell.cp('-R', 'static', 'prod/static');
