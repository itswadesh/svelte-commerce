import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getFormattedTimestamp, logWithTimestamp, logWithPerformance } from '../time'

describe('Time Utils', () => {
	let consoleLogSpy: vi.SpyInstance

	beforeEach(() => {

		consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
		// Mock Date to ensure consistent timestamps
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2024-01-15T10:30:45'))
	})

	afterEach(() => {
		consoleLogSpy.mockRestore()
		vi.useRealTimers()
	})

	describe('getFormattedTimestamp', () => {
		it('should return properly formatted timestamp', () => {
			const result = getFormattedTimestamp()
			expect(result).toMatch(/^\d{2} \w{3} \d{4}, \d{2}:\d{2}:\d{2} (AM|PM)$/)
		})

		it('should format date correctly for specific date', () => {
			vi.setSystemTime(new Date('2024-12-25T15:45:30'))
			const result = getFormattedTimestamp()
			expect(result).toBe('25 Dec 2024, 03:45:30 PM')
		})

		it('should handle different times of day', () => {
			vi.setSystemTime(new Date('2024-01-15T06:15:20'))
			const morningResult = getFormattedTimestamp()
			expect(morningResult).toBe('15 Jan 2024, 06:15:20 AM')

			vi.setSystemTime(new Date('2024-01-15T18:45:10'))
			const eveningResult = getFormattedTimestamp()
			expect(eveningResult).toBe('15 Jan 2024, 06:45:10 PM')
		})

		it('should handle midnight and noon correctly', () => {
			vi.setSystemTime(new Date('2024-01-15T00:00:00'))
			const midnightResult = getFormattedTimestamp()
			expect(midnightResult).toBe('15 Jan 2024, 12:00:00 AM')

			vi.setSystemTime(new Date('2024-01-15T12:00:00'))
			const noonResult = getFormattedTimestamp()
			expect(noonResult).toBe('15 Jan 2024, 12:00:00 PM')
		})
	})

	describe('logWithTimestamp', () => {
		it('should log message with timestamp', () => {
			const testMessage = 'Test log message'
			const extraArgs = ['arg1', 42, { key: 'value' }]

			logWithTimestamp(testMessage, ...extraArgs)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]

			// Check that the message contains the timestamp and the original message
			expect(loggedMessage).toContain('15 Jan 2024')
			expect(loggedMessage).toContain('10:30:45 AM')
			expect(loggedMessage).toContain(testMessage)

			// Check that ANSI color codes are present
			expect(loggedMessage).toContain('\x1b[33m') // yellow
			expect(loggedMessage).toContain('\x1b[0m') // reset
			expect(loggedMessage).toContain('\x1b[2m') // dim
		})

		it('should handle empty message', () => {
			logWithTimestamp('')

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('15 Jan 2024')
		})

		it('should handle message with special characters', () => {
			const specialMessage = 'Message with émojis 🚀 and symbols @#$%'
			logWithTimestamp(specialMessage)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain(specialMessage)
		})

		it('should pass through additional arguments', () => {
			const testMessage = 'Test with args'
			const arg1 = { complex: 'object' }
			const arg2 = [1, 2, 3]

			logWithTimestamp(testMessage, arg1, arg2)

			expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String), arg1, arg2)
		})
	})

	describe('logWithPerformance', () => {
		it('should log operation with duration', () => {
			const operation = 'Database query'
			const durationMs = 123.456789

			logWithPerformance(operation, durationMs)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]

			expect(loggedMessage).toContain('15 Jan 2024')
			expect(loggedMessage).toContain('10:30:45 AM')
			expect(loggedMessage).toContain(operation)
			expect(loggedMessage).toContain('(123.46ms)') // Should be rounded to 2 decimal places

			// Check ANSI color codes
			expect(loggedMessage).toContain('\x1b[32m') // green for duration
		})

		it('should handle zero duration', () => {
			logWithPerformance('Instant operation', 0)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(0.00ms)')
		})

		it('should handle very small durations', () => {
			logWithPerformance('Fast operation', 0.001)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(0.00ms)')
		})

		it('should handle large durations', () => {
			logWithPerformance('Slow operation', 12345.6789)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(12345.68ms)')
		})

		it('should handle negative durations', () => {
			logWithPerformance('Negative duration', -100.5)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(-100.50ms)')
		})

		it('should handle empty operation name', () => {
			logWithPerformance('', 50.25)

			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			const loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(50.25ms)')
		})

		it('should pass through additional arguments', () => {
			const operation = 'Complex operation'
			const duration = 99.99
			const metadata = { userId: 123, requestId: 'abc-123' }

			logWithPerformance(operation, duration, metadata)

			expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String), metadata)
		})
	})

	// Error handling tests
	describe('Error Handling', () => {
		it('should handle console.log errors gracefully', () => {

			consoleLogSpy.mockImplementation(() => {
				throw new Error('Console error')
			})

			expect(() => {
				logWithTimestamp('Test message')
			}).not.toThrow()

			expect(() => {
				logWithPerformance('Test operation', 100)
			}).not.toThrow()
		})

		it('should handle invalid duration values', () => {
			// Test with NaN
			logWithPerformance('NaN duration', Number.NaN)
			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			let loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(NaNms)')

			// Test with Infinity
			consoleLogSpy.mockClear()
			logWithPerformance('Infinity duration', Number.POSITIVE_INFINITY)
			expect(consoleLogSpy).toHaveBeenCalledTimes(1)
			loggedMessage = consoleLogSpy.mock.calls[0][0]
			expect(loggedMessage).toContain('(Infinityms)')
		})

		it('should handle malformed timestamp formatting', () => {
			// Mock toLocaleString to return unexpected format
			const originalToLocaleString = Date.prototype.toLocaleString
			Date.prototype.toLocaleString = vi.fn(() => 'Unexpected format')

			logWithTimestamp('Test')
			expect(consoleLogSpy).toHaveBeenCalledTimes(1)

			// Restore original method
			Date.prototype.toLocaleString = originalToLocaleString
		})
	})

	// Integration tests
	describe('Integration', () => {
		it('should maintain consistent timestamp format across functions', () => {
			const timestamp1 = getFormattedTimestamp()

			logWithTimestamp('First message')
			const loggedMessage1 = consoleLogSpy.mock.calls[0][0]

			consoleLogSpy.mockClear()
			logWithPerformance('Test operation', 50)
			const loggedMessage2 = consoleLogSpy.mock.calls[0][0]

			// Both logged messages should contain the same timestamp
			expect(loggedMessage1).toContain(timestamp1)
			expect(loggedMessage2).toContain(timestamp1)
		})

		it('should handle rapid successive calls', () => {
			vi.useRealTimers() // Use real timers for this test

			logWithTimestamp('Message 1')
			logWithPerformance('Operation 1', 10)
			logWithTimestamp('Message 2')

			expect(consoleLogSpy).toHaveBeenCalledTimes(3)

			// Each call should have a different timestamp (or at least not fail)
			const call1 = consoleLogSpy.mock.calls[0][0]
			const call2 = consoleLogSpy.mock.calls[1][0]
			const call3 = consoleLogSpy.mock.calls[2][0]

			expect(call1).toContain(' | Message 1')
			expect(call2).toContain(' | Operation 1')
			expect(call3).toContain(' | Message 2')
		})
	})
})
