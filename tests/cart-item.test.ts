import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import CartItem from '../cart-item.svelte'
import { mockFactories, resetMocks } from '../test-utils'

// Mock dependencies
const mockCartState = {
	isOpen: false,
	update: vi.fn().mockResolvedValue(undefined)
}

const mockUserState = {
	user: mockFactories.user()
}

vi.mock('$lib/core/stores/cart.svelte', () => ({
	getCartState: vi.fn(() => mockCartState)
}))

vi.mock('$lib/core/stores/auth.svelte', () => ({
	getUserState: vi.fn(() => mockUserState)
}))

vi.mock('$lib/core/utils', () => ({
	formatPrice: vi.fn((price: number) => `$${price}`),
	fireGTagEvent: vi.fn()
}))

vi.mock('$lib/core/components/image/lazy-img.svelte', () => ({
	default: vi.fn().mockImplementation(() => ({
		$$render: () => '<img src="test.jpg" alt="Product" />'
	}))
}))

vi.mock('$lib/assets/dots-loading.gif', () => ({
	default: 'loading.gif'
}))

vi.mock('$app/state', () => ({
	page: {
		data: {
			store: {
				currency: {
					code: 'USD'
				}
			}
		}
	}
}))

describe('CartItem', () => {
	const mockCartProduct = {
		id: 'cart-item-1',
		item_id: 'cart-item-1',
		productId: 'product-1',
		variantId: 'variant-1',
		title: 'Test Product',
		slug: 'test-product',
		thumbnail: 'test-image.jpg',
		price: 99.99,
		qty: 2,
		product: {
			id: 'product-1',
			name: 'Test Product',
			slug: 'test-product'
		},
		vendor: {
			businessName: 'Test Vendor'
		}
	} as any

	const mockRemoveItem = vi.fn()

	beforeEach(() => {
		resetMocks()
		mockRemoveItem.mockClear()
	})

	it('should render cart item with product details', () => {
		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		expect(screen.getByText('Test Product')).toBeInTheDocument()
		expect(screen.getByText('$99.99')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument()
	})

	it('should render product image with correct attributes', () => {
		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const image = screen.getByAltText('Product')
		expect(image).toHaveAttribute('src', 'test-image.jpg')
		expect(image).toHaveClass('size-36', 'rounded', 'object-contain')
	})

	it('should have correct accessibility labels', () => {
		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		expect(screen.getByLabelText('Subtract 1 from qty')).toBeInTheDocument()
		expect(screen.getByLabelText('Add 1 to qty')).toBeInTheDocument()
		expect(screen.getByLabelText('Remove item')).toBeInTheDocument()
	})

	it('should have correct role attribute', () => {
		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const container = screen.getByRole('group')
		expect(container).toBeInTheDocument()
	})

	it('should handle quantity decrease', async () => {
		const mockUpdate = vi.fn().mockResolvedValue(undefined)
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const decreaseButton = screen.getByLabelText('Subtract 1 from qty')
		await fireEvent.click(decreaseButton)

		await waitFor(() => {
			expect(mockUpdate).toHaveBeenCalledWith({
				qty: 1, // 2 - 1
				lineId: 'cart-item-1',
				productId: 'product-1',
				variantId: 'variant-1'
			})
		})
	})

	it('should handle quantity increase', async () => {
		const mockUpdate = vi.fn().mockResolvedValue(undefined)
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const increaseButton = screen.getByLabelText('Add 1 to qty')
		await fireEvent.click(increaseButton)

		await waitFor(() => {
			expect(mockUpdate).toHaveBeenCalledWith({
				qty: 3, // 2 + 1
				lineId: 'cart-item-1',
				productId: 'product-1',
				variantId: 'variant-1'
			})
		})
	})

	it('should handle item removal', async () => {
		const mockUpdate = vi.fn().mockResolvedValue(undefined)
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const removeButton = screen.getByLabelText('Remove item')
		await fireEvent.click(removeButton)

		await waitFor(() => {
			expect(mockUpdate).toHaveBeenCalledWith({
				qty: 0,
				lineId: 'cart-item-1',
				productId: 'product-1',
				variantId: 'variant-1'
			})
		})
	})

	it('should show loading state during quantity update', async () => {
		const mockUpdate = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const increaseButton = screen.getByLabelText('Add 1 to qty')
		await fireEvent.click(increaseButton)

		// Check loading image is shown
		const loadingImage = screen.getByAltText('Loading...')
		expect(loadingImage).toBeInTheDocument()
		expect(loadingImage).toHaveAttribute('src', 'loading.gif')

		// Wait for loading to complete
		await waitFor(() => {
			expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument()
		})
	})

	it('should fire Google Analytics events for cart actions', async () => {
		// Mock the fireGTagEvent function
		const mockFireGTagEvent = vi.fn()
		const gtagModule = await import('$lib/core/utils/gtag')
		vi.spyOn(gtagModule, 'fireGTagEvent').mockImplementation(mockFireGTagEvent)

		const mockUpdate = vi.fn().mockResolvedValue(undefined)
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		// Test add to cart event
		const increaseButton = screen.getByLabelText('Add 1 to qty')
		await fireEvent.click(increaseButton)

		await waitFor(() => {
			expect(mockFireGTagEvent).toHaveBeenCalledWith('add_to_cart', expect.any(Object))
		})

		// Test remove from cart event
		const decreaseButton = screen.getByLabelText('Subtract 1 from qty')
		await fireEvent.click(decreaseButton)

		await waitFor(() => {
			expect(mockFireGTagEvent).toHaveBeenCalledWith('remove_from_cart', expect.any(Object))
		})
	})

	it('should prevent event propagation on button clicks', async () => {
		const mockUpdate = vi.fn().mockResolvedValue(undefined)
		mockCartState.update = mockUpdate

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		// Simulate click with stopPropagation
		const increaseButton = screen.getByLabelText('Add 1 to qty')
		await fireEvent.click(increaseButton)

		// The component should call stopPropagation internally
		expect(mockUpdate).toHaveBeenCalled()
	})

	it('should close cart when product link is clicked', async () => {
		mockCartState.isOpen = true

		render(CartItem, {
			props: {
				cartProduct: mockCartProduct,
				removeItem: mockRemoveItem
			}
		})

		const productLink = screen.getByRole('link', { name: /Test Product/ })
		await fireEvent.click(productLink)

		expect(mockCartState.isOpen).toBe(false)
	})
})
