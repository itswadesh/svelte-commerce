module.exports = {
	apps: [
		{
			name: 'litekart-www:3000',
			script: 'npm',
			automation: false,
			args: 'start',
			env: {
				NODE_ENV: 'development'
			},
			envProduction: {
				NODE_ENV: 'production'
			}
		}
	]
}
