import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest'
import { debounce } from '../debounce'

describe('debounce', () => {
	let mockFn: MockedFunction<any>
	let debouncedFn: (...args: any[]) => void

	beforeEach(() => {
		mockFn = vi.fn()
		debouncedFn = debounce(mockFn, 100)
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('should call the function after the specified wait time', () => {
		debouncedFn()

		expect(mockFn).not.toHaveBeenCalled()

		vi.advanceTimersByTime(100)

		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('should reset the timer when called multiple times', () => {
		debouncedFn()
		vi.advanceTimersByTime(50)

		debouncedFn() // Reset timer
		vi.advanceTimersByTime(50)

		expect(mockFn).not.toHaveBeenCalled()

		vi.advanceTimersByTime(50)

		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('should call the function with the correct arguments', () => {
		const debouncedWithArgs = debounce((a: number, b: string) => mockFn(a, b), 100)

		debouncedWithArgs(42, 'test')

		vi.advanceTimersByTime(100)

		expect(mockFn).toHaveBeenCalledWith(42, 'test')
	})

	it('should preserve the context', () => {
		const context = { value: 'test' }
		const mockFnWithContext = vi.fn(function (this: typeof context) {
			return this.value
		})

		const debouncedFn = debounce(mockFnWithContext, 100)

		debouncedFn.call(context)

		vi.advanceTimersByTime(100)

		expect(mockFnWithContext).toHaveBeenCalled()
	})
})
