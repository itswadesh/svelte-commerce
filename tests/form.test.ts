import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { FormField, FormLabel, FormDescription, FormFieldErrors, FormButton } from '../index'

// Mock formsnap
vi.mock('formsnap', () => ({
	Field: ({ children, form, name }: any) => {
		const mockProps = {
			constraints: {},
			errors: [],
			tainted: false,
			value: 'mock-value'
		}
		return children(mockProps)
	},
	Label: ({ children, ...props }: any) => {
		const mockProps = { props }
		return children({ props: mockProps })
	},
	Description: ({ children }: any) => children(),
	FieldErrors: ({ children }: any) => children(),
	Button: ({ children, ...props }: any) => {
		return {
			$$render: () =>
				`<button ${Object.entries(props)
					.map(([k, v]) => `${k}="${v}"`)
					.join(' ')}>${children()}</button>`
		}
	}
}))

// Mock the label component
vi.mock('$lib/components/ui/label/index.js', () => ({
	Label: ({ children, class: className, ...props }: any) => {
		return {
			$$render: () =>
				`<label class="${className || ''}" ${Object.entries(props)
					.map(([k, v]) => `${k}="${v}"`)
					.join(' ')}>${children()}</label>`
		}
	}
}))

describe('Form Components', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render FormField component', async () => {
		const mockForm = { test: 'form' }
		const { container } = render(FormField, {
			props: {
				form: mockForm,
				name: 'testField',
				children: ({ value, errors }) => `Value: ${value}, Errors: ${errors.length}`
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect(container.firstChild).toHaveClass('space-y-2')
	})

	it('should render FormLabel component', async () => {
		const { container } = render(FormLabel, {
			props: {
				children: () => 'Test Label'
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should render FormDescription component', async () => {
		const { container } = render(FormDescription, {
			props: {
				children: () => 'Test description'
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should render FormFieldErrors component', async () => {
		const { container } = render(FormFieldErrors, {
			props: {
				children: () => 'Error message'
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should render FormButton component', async () => {
		const { container } = render(FormButton, {
			props: {
				children: () => 'Submit'
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect(container.firstChild?.tagName).toBe('BUTTON')
	})

	// Error handling tests
	it('should handle FormField with validation errors', async () => {
		const mockForm = { test: 'form' }
		const { container } = render(FormField, {
			props: {
				form: mockForm,
				name: 'testField',
				children: ({ errors }) => (errors.length > 0 ? 'Has errors' : 'No errors')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should handle FormField with constraints', async () => {
		const mockForm = { test: 'form' }
		const { container } = render(FormField, {
			props: {
				form: mockForm,
				name: 'testField',
				children: ({ constraints }) => `Constraints: ${Object.keys(constraints).length}`
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should handle FormLabel with error state', async () => {
		const { container } = render(FormLabel, {
			props: {
				class: 'error-class',
				children: () => 'Error Label'
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	// Accessibility tests
	it('should have proper form structure', async () => {
		const mockForm = { test: 'form' }
		render(FormField, {
			props: {
				form: mockForm,
				name: 'email',
				children: () =>
					render(FormLabel, {
						props: { children: () => 'Email' }
					})
			}
		})
		const label = screen.getByText('Email')
		expect(label).toBeInTheDocument()
	})

	it('should support custom attributes', async () => {
		const mockForm = { test: 'form' }
		const { container } = render(FormField, {
			props: {
				form: mockForm,
				name: 'testField',
				'data-testid': 'custom-field',
				children: () => 'Test'
			}
		})
		expect(container.firstChild).toHaveAttribute('data-testid', 'custom-field')
	})
})
