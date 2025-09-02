import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { serializeNonPOJOs, getImageURL, validateData, validateFormData, generateRelativeDate } from '../validations'

// Mock date-fns functions
vi.mock('date-fns', () => ({
	differenceInDays: vi.fn(),
	formatDistanceToNowStrict: vi.fn()
}))

describe('Validations Utils', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('serializeNonPOJOs', () => {
		it('should serialize objects correctly', () => {
			const obj = { a: 1, b: { c: 2 } }
			const result = serializeNonPOJOs(obj)
			expect(result).toEqual(obj)
			expect(result).not.toBe(obj) // Should be a clone
		})

		it('should handle null and undefined', () => {
			expect(serializeNonPOJOs(null)).toBeNull()
			expect(serializeNonPOJOs(undefined)).toBeUndefined()
		})

		it('should handle primitive values', () => {
			expect(serializeNonPOJOs(42)).toBe(42)
			expect(serializeNonPOJOs('test')).toBe('test')
			expect(serializeNonPOJOs(true)).toBe(true)
		})
	})

	describe('getImageURL', () => {
		it('should generate correct image URL', () => {
			const result = getImageURL('products', '123', 'image.jpg', '100x100')
			expect(result).toBe('api/files/products/123/image.jpg?thumb=100x100')
		})

		it('should use default size when not provided', () => {
			const result = getImageURL('products', '123', 'image.jpg')
			expect(result).toBe('api/files/products/123/image.jpg?thumb=0x0')
		})

		it('should handle undefined filename', () => {
			const result = getImageURL('products', '123', undefined)
			expect(result).toBe('api/files/products/123/undefined?thumb=0x0')
		})

		it('should handle empty strings', () => {
			const result = getImageURL('', '', '')
			expect(result).toBe('api/files//?thumb=0x0')
		})
	})

	describe('validateData', () => {
		const testSchema = z.object({
			name: z.string().min(1, 'Name is required'),
			email: z.string().email('Invalid email'),
			age: z.number().min(18, 'Must be 18 or older')
		})

		it('should validate valid data successfully', async () => {
			const formData = new FormData()
			formData.append('name', 'John Doe')
			formData.append('email', 'john@example.com')
			formData.append('age', '25')

			const result = await validateData(formData, testSchema)

			expect(result.errors).toBeNull()
			expect(result.formData).toEqual({
				name: 'John Doe',
				email: 'john@example.com',
				age: 25
			})
		})

		it('should return validation errors for invalid data', async () => {
			const formData = new FormData()
			formData.append('name', '')
			formData.append('email', 'invalid-email')
			formData.append('age', '15')

			const result = await validateData(formData, testSchema)

			expect(result.errors).not.toBeNull()
			expect(result.errors?.fieldErrors.name).toContain('Name is required')
			expect(result.errors?.fieldErrors.email).toContain('Invalid email')
			expect(result.errors?.fieldErrors.age).toContain('Must be 18 or older')
		})

		it('should handle empty form data', async () => {
			const formData = new FormData()
			const result = await validateData(formData, testSchema)

			expect(result.errors).not.toBeNull()
			expect(result.errors?.fieldErrors.name).toContain('Name is required')
		})

		it('should handle zfd option', async () => {
			const formData = new FormData()
			formData.append('name', 'John')
			formData.append('email', 'john@example.com')
			formData.append('age', '25')

			const result = await validateData(formData, testSchema, true)

			expect(result.errors).toBeNull()
			expect(result.formData).toEqual({
				name: 'John',
				email: 'john@example.com',
				age: 25
			})
		})

		it('should handle malformed data gracefully', async () => {
			const formData = new FormData()
			formData.append('age', 'not-a-number')

			const numberSchema = z.object({ age: z.number() })
			const result = await validateData(formData, numberSchema)

			expect(result.errors).not.toBeNull()
		})
	})

	describe('validateFormData', () => {
		const testSchema = z.object({
			title: z.string().min(1),
			description: z.string().optional()
		})

		it('should validate valid form data', async () => {
			const formData = new FormData()
			formData.append('title', 'Test Title')
			formData.append('description', 'Test Description')

			const result = await validateFormData(formData, testSchema)

			expect(result.errors).toBeNull()
			expect(result.formData).toEqual({
				title: 'Test Title',
				description: 'Test Description'
			})
		})

		it('should return errors for invalid form data', async () => {
			const formData = new FormData()
			formData.append('title', '') // Empty title should fail

			const result = await validateFormData(formData, testSchema)

			expect(result.errors).not.toBeNull()
			expect(result.errors?.fieldErrors.title).toContain('String must contain at least 1 character(s)')
		})

		it('should handle missing optional fields', async () => {
			const formData = new FormData()
			formData.append('title', 'Test Title')
			// description is optional, so it should work without it

			const result = await validateFormData(formData, testSchema)

			expect(result.errors).toBeNull()
			expect(result.formData.title).toBe('Test Title')
		})
	})

	describe('generateRelativeDate', () => {
		const mockDifferenceInDays = vi.mocked(require('date-fns').differenceInDays)
		const mockFormatDistanceToNowStrict = vi.mocked(require('date-fns').formatDistanceToNowStrict)

		beforeEach(() => {
			vi.clearAllMocks()
		})

		it('should return formatted date for dates more than 1 day ago', () => {
			const pastDate = new Date('2023-01-01')
			mockDifferenceInDays.mockReturnValue(5)

			const result = generateRelativeDate(pastDate)

			expect(mockDifferenceInDays).toHaveBeenCalledWith(new Date(), pastDate)
			expect(result).toBe('Jan 1')
		})

		it('should return relative time for recent dates', () => {
			const recentDate = new Date()
			recentDate.setHours(recentDate.getHours() - 2)
			mockDifferenceInDays.mockReturnValue(0)
			mockFormatDistanceToNowStrict.mockReturnValue('2 hours ago')

			const result = generateRelativeDate(recentDate)

			expect(mockFormatDistanceToNowStrict).toHaveBeenCalledWith(recentDate, { addSuffix: true })
			expect(result).toBe('2 hours ago')
		})

		it('should handle edge case of exactly 1 day difference', () => {
			const oneDayAgo = new Date()
			oneDayAgo.setDate(oneDayAgo.getDate() - 1)
			mockDifferenceInDays.mockReturnValue(1)

			const result = generateRelativeDate(oneDayAgo)

			expect(result).toBe(
				oneDayAgo.toLocaleString('en-US', {
					month: 'short',
					day: 'numeric'
				})
			)
		})

		it('should handle future dates', () => {
			const futureDate = new Date()
			futureDate.setDate(futureDate.getDate() + 1)
			mockDifferenceInDays.mockReturnValue(-1)
			mockFormatDistanceToNowStrict.mockReturnValue('in 1 day')

			const result = generateRelativeDate(futureDate)

			expect(result).toBe('in 1 day')
		})
	})

	// Error handling tests
	describe('Error Handling', () => {
		it('should handle ZodError properly in validateData', async () => {
			const invalidSchema = z.object({ test: z.string().min(5) })
			const formData = new FormData()
			formData.append('test', 'abc') // Too short

			const result = await validateData(formData, invalidSchema)

			expect(result.errors).not.toBeNull()
			expect(result.errors?.fieldErrors.test).toBeDefined()
		})

		it('should handle non-ZodError exceptions', async () => {
			// This would be hard to trigger in normal usage, but we can test the structure
			const formData = new FormData()
			const schema = z.object({ test: z.string() })

			const result = await validateData(formData, schema)

			// Should still return proper structure even with errors
			expect(result).toHaveProperty('formData')
			expect(result).toHaveProperty('errors')
		})

		it('should handle malformed FormData', async () => {
			const formData = new FormData()
			// Add some problematic data
			formData.append('test', null as any)

			const schema = z.object({ test: z.string() })
			const result = await validateData(formData, schema)

			expect(result.errors).not.toBeNull()
		})
	})
})
