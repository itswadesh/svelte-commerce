// Registers the jest-dom matchers with `expect` *and* augments Vitest's `Assertion`
// interface, so `toBeInTheDocument()` & co. are typed as well as available at runtime.
import '@testing-library/jest-dom/vitest'

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
