import { describe, it, expect } from 'vitest'

// Basic test to ensure the component can be imported
describe('Button Component', () => {
	it('should be importable', async () => {
		const Button = await import('../button.svelte')
		expect(Button).toBeDefined()
		expect(Button.default).toBeDefined()
	})

	it('should have proper component structure', async () => {
		const component = await import('../button.svelte')
		expect(component.default).toBeDefined()
		// Basic smoke test - component exists and has expected properties
		expect(typeof component.default).toBe('function')
	})

	it('should export button variants', async () => {
		const component = await import('../button.svelte')
		expect(component.buttonVariants).toBeDefined()
		expect(typeof component.buttonVariants).toBe('function')
	})

	it('should export button variants function', async () => {
		const component = await import('../button.svelte')
		expect(component.buttonVariants).toBeDefined()
		expect(typeof component.buttonVariants).toBe('function')
	})
})
