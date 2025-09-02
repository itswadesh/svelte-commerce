import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import StatusCell from '../status-cell.svelte'

describe('StatusCell', () => {
	it('should render nothing when no value is provided', () => {
		const { container } = render(StatusCell, { props: {} })
		expect(container.firstChild).toBeNull()
	})

	it('should render with positive status styling for "active"', () => {
		const { getByText } = render(StatusCell, { props: { value: 'active' } })
		const element = getByText('active')

		expect(element).toHaveClass('bg-green-50', 'text-green-700')
	})

	it('should render with warning status styling for "processing"', () => {
		const { getByText } = render(StatusCell, { props: { value: 'processing' } })
		const element = getByText('processing')

		expect(element).toHaveClass('bg-yellow-50', 'text-yellow-700')
	})

	it('should render with error status styling for "failed"', () => {
		const { getByText } = render(StatusCell, { props: { value: 'failed' } })
		const element = getByText('failed')

		expect(element).toHaveClass('bg-red-50', 'text-red-700')
	})

	it('should render with pending status styling for "pending"', () => {
		const { getByText } = render(StatusCell, { props: { value: 'pending' } })
		const element = getByText('pending')

		expect(element).toHaveClass('bg-gray-50', 'text-gray-700')
	})

	it('should render with refunded status and Undo icon', () => {
		const { getByText, container } = render(StatusCell, { props: { value: 'refunded' } })
		const element = getByText('refunded')

		expect(element).toHaveClass('bg-orange-50', 'text-orange-700')
		// Check for Undo icon
		const undoIcon = container.querySelector('svg')
		expect(undoIcon).toBeInTheDocument()
	})

	it('should render with fulfilling status and Package2 icon', () => {
		const { getByText, container } = render(StatusCell, { props: { value: 'fulfilling' } })
		const element = getByText('fulfilling')

		expect(element).toHaveClass('bg-purple-50', 'text-purple-700')
		// Check for Package2 icon
		const packageIcon = container.querySelector('svg')
		expect(packageIcon).toBeInTheDocument()
	})

	it('should handle case insensitive status values', () => {
		const { getByText } = render(StatusCell, { props: { value: 'ACTIVE' } })
		const element = getByText('ACTIVE')

		expect(element).toHaveClass('bg-green-50', 'text-green-700')
	})

	it('should render with default styling for unknown status', () => {
		const { getByText } = render(StatusCell, { props: { value: 'unknown' } })
		const element = getByText('unknown')

		expect(element).toHaveClass('bg-gray-50', 'text-gray-700')
	})
})
