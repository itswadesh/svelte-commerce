#!/usr/bin/env bun

import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

// This wrapper script allows Bun to execute Playwright tests more efficiently
// It handles process management for both the web server and test runner

const args = process.argv.slice(2)
const isUiMode = args.includes('--ui')

// Start the playwright test process
async function runTests() {
	console.log('🚀 Running tests with Bun and Playwright')

	// Cross-platform command setup (Windows doesn't use sudo)
	const isWindows = process.platform === 'win32'
	const testCommand = isWindows ? 'npx playwright test' : process.getuid?.() === 0 ? 'playwright test' : 'sudo playwright test'

	// Add UI flag if specified
	const fullCommand = isUiMode ? `${testCommand} --ui` : testCommand

	const playwright = spawn(fullCommand, {
		shell: true,
		stdio: 'inherit',
		cwd: process.cwd()
	})

	return new Promise((resolve, reject) => {
		playwright.on('close', (code) => {
			if (code === 0) {
				console.log('✅ Tests completed successfully!')
				resolve()
			} else {
				console.error(`❌ Tests failed with code ${code}`)
				reject(new Error(`Tests failed with code ${code}`))
			}
		})
	})
}

try {
	await runTests()
	process.exit(0)
} catch (error) {
	console.error('Test execution error:', error)
	process.exit(1)
}
