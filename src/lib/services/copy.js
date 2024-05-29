import shell from 'shelljs'

if (!shell.test('-f', '.env')) {
	// shell.cp('.env.example', '.env')
	shell.cp('.env.prodexa.example', '.env')
}
