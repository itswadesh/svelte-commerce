// For Vitest, we need to import matchers differently
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

expect.extend(matchers)

// Global test utilities
globalThis.matchMedia =
	globalThis.matchMedia ||
	(() => ({
		matches: false,
		addListener: () => {},
		removeListener: () => {}
	}))

// Mock IntersectionObserver
// @ts-ignore
globalThis.IntersectionObserver = class IntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock ResizeObserver
// @ts-ignore
globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock fetch if needed
// globalThis.fetch = vi.fn()

// Add any custom matchers here
// expect.extend({ ... })

// Cleanup after each test
import { cleanup } from '@testing-library/svelte'
import { afterEach } from 'vitest'

afterEach(() => {
	cleanup()
})
