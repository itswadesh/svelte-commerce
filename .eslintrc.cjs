module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	// Some preference rules by KitQL
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-console': ['error', { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] }]
	},
	ignorePatterns: ['*.cjs'],
	overrides: [
		{ files: ['*.svelte'], processor: 'svelte3/svelte3' },
		{
			files: ['*.graphql', '*.gql'],
			parserOptions: {
				operations: '**/*.gql',
				schema: '**/*.graphql'
			},
			// Enable all rules
			extends: ['plugin:@graphql-eslint/schema-all', 'plugin:@graphql-eslint/operations-all'],
			// Some preference rules by KitQL
			rules: {
				'@graphql-eslint/alphabetize': 'off',
				'@graphql-eslint/match-document-filename': [
					'error',
					{
						query: { style: 'PascalCase', suffix: '_QUERY' },
						mutation: { style: 'PascalCase', suffix: '_MUTATION' },
						subscription: { style: 'PascalCase', suffix: '_SUB' },
						fragment: { style: 'PascalCase', suffix: '_FRAG' }
					}
				],
				'@graphql-eslint/no-unused-fields': 'error',
				'@graphql-eslint/unique-enum-value-names': 'error',
				'@graphql-eslint/require-id-when-available': 'error'
			}
		}
	],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
}
