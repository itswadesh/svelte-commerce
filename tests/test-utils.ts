import { render, type RenderOptions } from '@testing-library/svelte'
import type { SvelteComponent } from 'svelte'
import { expect, vi } from 'vitest'

// Custom render function for components with providers
export function customRender<T extends Record<string, any>>(component: typeof SvelteComponent, props: T = {} as T, options: RenderOptions = {}) {
	return render(component, {
		props,
		...options
	})
}

// Mock data factories
export const mockFactories = {
	user: () => ({
		id: 'user-1',
		email: 'test@example.com',
		name: 'Test User',
		avatar: 'https://example.com/avatar.jpg'
	}),

	product: () => ({
		id: 'product-1',
		name: 'Test Product',
		price: 99.99,
		image: 'https://example.com/product.jpg',
		description: 'A test product description',
		category: 'Electronics',
		inStock: true,
		rating: 4.5,
		reviews: 42
	}),

	cartItem: () => ({
		id: 'cart-item-1',
		product: mockFactories.product(),
		quantity: 2,
		price: 99.99,
		total: 199.98
	}),

	cart: () => ({
		id: 'cart-1',
		items: [mockFactories.cartItem()],
		total: 199.98,
		tax: 19.99,
		shipping: 9.99,
		grandTotal: 229.96
	}),

	address: () => ({
		id: 'address-1',
		name: 'John Doe',
		street: '123 Main St',
		city: 'New York',
		state: 'NY',
		zipCode: '10001',
		country: 'USA',
		isDefault: true
	}),

	order: () => ({
		id: 'order-1',
		status: 'pending',
		total: 229.96,
		items: [mockFactories.cartItem()],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	})
}

// Common test patterns
export const testPatterns = {
	// Test user interactions
	async clickButton(screen: any, testId: string) {
		const button = screen.getByTestId(testId)
		await button.click()
		return button
	},

	async typeInput(screen: any, testId: string, value: string) {
		const input = screen.getByTestId(testId)
		await input.type(value)
		return input
	},

	async selectOption(screen: any, testId: string, value: string) {
		const select = screen.getByTestId(testId)
		await select.select(value)
		return select
	},

	// Test form submissions
	async submitForm(screen: any, testId: string) {
		const form = screen.getByTestId(testId)
		await form.requestSubmit()
		return form
	},

	// Test accessibility
	checkAriaLabel(screen: any, testId: string, expectedLabel: string) {
		const element = screen.getByTestId(testId)
		expect(element).toHaveAttribute('aria-label', expectedLabel)
	},

	checkRole(screen: any, testId: string, expectedRole: string) {
		const element = screen.getByTestId(testId)
		expect(element).toHaveAttribute('role', expectedRole)
	},

	// Test loading states
	checkLoadingState(screen: any, testId: string) {
		const element = screen.getByTestId(testId)
		expect(element).toHaveAttribute('aria-busy', 'true')
	},

	// Test error states
	checkErrorMessage(screen: any, testId: string, expectedMessage: string) {
		const errorElement = screen.getByTestId(testId)
		expect(errorElement).toHaveTextContent(expectedMessage)
	},

	// Test validation
	async triggerValidation(screen: any, testId: string) {
		const input = screen.getByTestId(testId)
		await input.blur()
		return input
	}
}

// Mock functions for event handlers
export const mockEventHandlers = {
	onClick: vi.fn(),
	onSubmit: vi.fn(),
	onChange: vi.fn(),
	onInput: vi.fn(),
	onFocus: vi.fn(),
	onBlur: vi.fn(),
	onKeyDown: vi.fn(),
	onKeyUp: vi.fn(),
	onMouseEnter: vi.fn(),
	onMouseLeave: vi.fn()
}

// Utility to reset all mock functions
export function resetMocks() {
	for (const mock of Object.values(mockEventHandlers)) {
		mock.mockReset()
	}
}

// Utility to create mock stores
export function createMockStore<T>(initialValue: T) {
	let value = initialValue
	const subscribers = new Set<(value: T) => void>()

	return {
		subscribe(callback: (value: T) => void) {
			subscribers.add(callback)
			callback(value)
			return () => subscribers.delete(callback)
		},
		set(newValue: T) {
			value = newValue
			for (const callback of subscribers) {
				callback(value)
			}
		},
		update(updater: (value: T) => T) {
			value = updater(value)
			for (const callback of subscribers) {
				callback(value)
			}
		},
		get() {
			return value
		}
	}
}
