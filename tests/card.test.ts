import { describe, it, expect } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render, screen } from '@testing-library/svelte'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'

// Svelte 5 components take a `children` snippet, so wrap plain test text in one
const textSnippet = (text: string) =>
	createRawSnippet<[]>(() => ({
		render: () => `<span>${text}</span>`
	}))

// Basic smoke tests
describe('Card Component', () => {
	it('should render Card component', async () => {
		const { container } = render(Card, {
			props: {
				children: textSnippet('Test content')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect(container.firstChild).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow')
	})

	it('should render Card with custom class', async () => {
		const { container } = render(Card, {
			props: {
				class: 'custom-class',
				children: textSnippet('Test content')
			}
		})
		expect(container.firstChild).toHaveClass('custom-class')
	})

	it('should render CardContent component', async () => {
		const { container } = render(CardContent, {
			props: {
				children: textSnippet('Content text')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect(container.firstChild).toHaveClass('p-6')
	})

	it('should render CardHeader component', async () => {
		const { container } = render(CardHeader, {
			props: {
				children: textSnippet('Header content')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should render CardTitle component', async () => {
		const { container } = render(CardTitle, {
			props: {
				children: textSnippet('Card Title')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect((container.firstChild as HTMLElement)?.tagName).toBe('H3')
	})

	it('should render CardDescription component', async () => {
		const { container } = render(CardDescription, {
			props: {
				children: textSnippet('Card description')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
		expect((container.firstChild as HTMLElement)?.tagName).toBe('P')
	})

	it('should render CardFooter component', async () => {
		const { container } = render(CardFooter, {
			props: {
				children: textSnippet('Footer content')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	// Integration test - simplified
	it('should render complete card structure', async () => {
		const { container } = render(Card, {
			props: {
				children: textSnippet('Complete Card Content')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	// Error handling tests
	it('should handle empty children gracefully', async () => {
		const { container } = render(Card, {
			props: {
				children: textSnippet('')
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	it('should handle undefined children gracefully', async () => {
		const { container } = render(Card, {
			props: {
				children: undefined
			}
		})
		expect(container.firstChild).toBeInTheDocument()
	})

	// Accessibility tests
	it('should have proper semantic structure', async () => {
		render(Card, {
			props: {
				children: textSnippet('Accessible Card')
			}
		})
		expect(screen.getByText('Accessible Card')).toBeInTheDocument()
	})

	it('should support custom attributes', async () => {
		const { container } = render(Card, {
			props: {
				'data-testid': 'custom-card',
				children: textSnippet('Test')
			}
		})
		expect(container.firstChild).toHaveAttribute('data-testid', 'custom-card')
	})
})
