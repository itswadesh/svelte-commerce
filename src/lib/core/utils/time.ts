// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	cyan: '\x1b[36m',
	yellow: '\x1b[33m',
	dim: '\x1b[2m',
	green: '\x1b[32m'
} as const

export function getFormattedTimestamp(): string {
	return new Date().toLocaleString('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true
	})
}

export function logWithTimestamp(message: string, ...args: any[]): void {
	const timestamp = getFormattedTimestamp()
	console.log(`${colors.yellow}${timestamp}${colors.reset}${colors.dim} |${colors.reset} ${message}`, ...args)
}

export function logWithPerformance(operation: string, durationMs: number, ...args: any[]): void {
	const timestamp = getFormattedTimestamp()
	console.log(
		`${colors.yellow}${timestamp}${colors.reset}${colors.dim} |${colors.reset} ${operation} ${colors.green}(${durationMs.toFixed(2)}ms)${colors.reset}`,
		...args
	)
}
