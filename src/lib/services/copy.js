import shell from 'shelljs'

if (!shell.test('-f', '.env')) {
	shell.cp('.env.example', '.env')
}
