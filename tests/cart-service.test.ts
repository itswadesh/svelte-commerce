import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CartService } from '../src/lib/core/services/medusa/cart-service'
import { ApiService } from '../src/lib/core/services/medusa/api-service'

// Mock ApiService
vi.mock('../src/lib/core/services/medusa/api-service', () => ({
	ApiService: {
		get: vi.fn(),
		post: vi.fn(),
		delete: vi.fn()
	}
}))

describe('CartService', () => {
	const mockApiService = ApiService as any

	beforeEach(() => {
		vi.clearAllMocks()
		// Mock localStorage
		const mockLocalStorage = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn()
		}
		Object.defineProperty(window, 'localStorage', {
			value: mockLocalStorage,
			writable: true
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('getCartByCartId', () => {
		it('should fetch cart by ID and format line items', async () => {
			const mockCartData = {
				cart: {
					id: 'cart-123',
					items: [
						{ product_title: 'Test Product', variant_id: 'var-1' },
						{ product_title: 'Test Product 2', variant_id: 'var-2' }
					]
				}
			}

			mockApiService.get.mockResolvedValue(mockCartData)

			const result = await CartService.getCartByCartId('cart-123')

			expect(mockApiService.get).toHaveBeenCalledWith('/store/carts/cart-123')
			expect(result.lineItems).toHaveLength(2)
			expect(result.lineItems[0].title).toBe('Test Product')
		})

		it('should handle API errors', async () => {
			mockApiService.get.mockRejectedValue(new Error('API Error'))

			await expect(CartService.getCartByCartId('cart-123')).rejects.toThrow('API Error')
		})
	})

	describe('fetchCartData', () => {
		it('should fetch cart data from localStorage', async () => {
			const mockCartData = {
				cart: {
					id: 'cart-123',
					items: [{ product_title: 'Test Product' }]
				}
			}

			mockApiService.get.mockResolvedValue(mockCartData)
			;(window.localStorage.getItem as any).mockReturnValue('cart-123')

			const result = await CartService.fetchCartData()

			expect(mockApiService.get).toHaveBeenCalledWith('/store/carts/cart-123')
			expect(result.lineItems).toHaveLength(1)
		})

		it('should return null when no cart ID in localStorage', async () => {
			;(window.localStorage.getItem as any).mockReturnValue(null)

			const result = await CartService.fetchCartData()

			expect(result).toBeNull()
			expect(mockApiService.get).not.toHaveBeenCalled()
		})
	})

	describe('updateCart', () => {
		it('should update cart item quantity', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.post.mockResolvedValue(mockCartResponse)
			;(window.localStorage.getItem as any).mockReturnValue('cart-123')

			await CartService.updateCart({
				qty: 5,
				cartId: 'cart-123',
				lineId: 'line-123',
				productId: 'prod-1',
				variantId: 'var-1'
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123/line-items/line-123', {
				variant_id: 'var-1',
				quantity: 5
			})
		})

		it('should create new cart if no cartId exists', async () => {
			const mockCreateCartResponse = { cart: { id: 'new-cart' } }
			const mockUpdateResponse = { cart: { id: 'new-cart', items: [] } }

			mockApiService.post.mockResolvedValueOnce(mockCreateCartResponse).mockResolvedValueOnce(mockUpdateResponse)
			;(window.localStorage.getItem as any).mockReturnValue(null)

			await CartService.updateCart({
				qty: 2,
				lineId: null,
				productId: 'prod-1',
				variantId: 'var-1'
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts', { region_id: '' })
		})
	})

	describe('removeCart', () => {
		it('should remove item from cart', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.delete.mockResolvedValue({})
			mockApiService.post
				.mockResolvedValue(mockCartResponse)(window.localStorage.getItem as any)
				.mockReturnValue('cart-123')

			const result = await CartService.removeCart({ cartId: 'cart-123', lineId: 'line-123' })

			expect(mockApiService.delete).toHaveBeenCalledWith('/store/carts/cart-123/line-items/line-123')
			expect(result.lineItems).toEqual([])
		})

		it('should create new cart if no cartId', async () => {
			const mockCreateCartResponse = { cart: { id: 'new-cart' } }

			mockApiService.post.mockResolvedValue(mockCreateCartResponse)
			;(window.localStorage.getItem as any).mockReturnValue(null)

			await CartService.removeCart({ cartId: 'undefined', lineId: null })

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts', { region_id: '' })
		})
	})

	describe('updateCart', () => {
		it('should update cart item quantity', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.post.mockResolvedValue(mockCartResponse)
			;(window.localStorage.getItem as any).mockReturnValue('cart-123')

			await CartService.updateCart({
				qty: 5,
				cartId: 'cart-123',
				lineId: 'line-123',
				productId: 'prod-1',
				variantId: 'var-1'
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123/line-items/line-123', {
				variant_id: 'var-1',
				quantity: 5
			})
		})

		it('should create new cart if no cartId exists', async () => {
			const mockCreateCartResponse = { cart: { id: 'new-cart' } }
			const mockUpdateResponse = { cart: { id: 'new-cart', items: [] } }

			mockApiService.post
				.mockResolvedValueOnce(mockCreateCartResponse)
				.mockResolvedValueOnce(mockUpdateResponse)(window.localStorage.getItem as any)
				.mockReturnValue(null)

			await CartService.updateCart({
				qty: 2,
				lineId: null,
				productId: 'prod-1',
				variantId: 'var-1'
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts', { region_id: '' })
		})
	})

	describe('applyCoupon', () => {
		it('should apply coupon to cart', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.post.mockResolvedValue(mockCartResponse)

			const result = await CartService.applyCoupon({ cartId: 'cart-123', couponCode: 'DISCOUNT10' })

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123/promotions', {
				code: 'DISCOUNT10'
			})
			expect(result.lineItems).toEqual([])
		})
	})

	describe('completeCart', () => {
		it('should complete cart', async () => {
			const mockResponse = { order: { id: 'order-123' } }

			mockApiService.post.mockResolvedValue(mockResponse)

			const result = await CartService.completeCart('cart-123')

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123/complete', {})
			expect(result).toEqual(mockResponse)
		})
	})

	describe('updateCart2', () => {
		it('should update cart with customer and address information', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.post
				.mockResolvedValueOnce({}) // customer update
				.mockResolvedValueOnce({}) // shipping address
				.mockResolvedValueOnce(mockCartResponse)(
					// final get

					window.localStorage.getItem as any
				)
				.mockReturnValue('cart-123')

			await CartService.updateCart2({
				cartId: 'cart-123',
				email: 'test@example.com',
				shippingAddress: {
					firstName: 'John',
					lastName: 'Doe',
					address_1: '123 Main St',
					city: 'Test City',
					state: 'Test State',
					zip: '12345',
					countryCode: 'US',
					phone: '123-456-7890'
				}
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123/customer', {
				email: 'test@example.com'
			})
			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123', {
				shipping_address: {
					first_name: 'John',
					last_name: 'Doe',
					address_1: '123 Main St',
					address_2: undefined,
					city: 'Test City',
					province: 'Test State',
					postal_code: '12345',
					country_code: 'US',
					phone: '123-456-7890'
				}
			})
		})

		it('should handle billing address when different from shipping', async () => {
			const mockCartResponse = { cart: { id: 'cart-123', items: [] } }

			mockApiService.post
				.mockResolvedValueOnce({})
				.mockResolvedValueOnce({})
				.mockResolvedValueOnce({})
				.mockResolvedValueOnce(mockCartResponse)(window.localStorage.getItem as any)
				.mockReturnValue('cart-123')

			await CartService.updateCart2({
				cartId: 'cart-123',
				shippingAddress: {
					firstName: 'John',
					lastName: 'Doe',
					address_1: '123 Main St',
					city: 'Test City',
					state: 'Test State',
					zip: '12345',
					countryCode: 'US',
					phone: '123-456-7890'
				},
				billingAddress: {
					firstName: 'Jane',
					lastName: 'Doe',
					address_1: '456 Billing St',
					city: 'Billing City',
					state: 'Billing State',
					zip: '67890',
					countryCode: 'US',
					phone: '098-765-4321'
				},
				isBillingAddressSameAsShipping: false
			})

			expect(mockApiService.post).toHaveBeenCalledWith('/store/carts/cart-123', {
				billing_address: {
					first_name: 'Jane',
					last_name: 'Doe',
					address_1: '456 Billing St',
					address_2: undefined,
					city: 'Billing City',
					province: 'Billing State',
					postal_code: '67890',
					country_code: 'US',
					phone: '098-765-4321'
				}
			})
		})
	})
})
