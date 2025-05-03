import { CategoryService } from '$lib/core/services'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from '../../../../../routes/(www)/categories/$types'

// Sample categories data for development
const sampleCategories = [
	{
		id: 1,
		name: 'Women',
		slug: 'women',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women.png',
		children: [
			{ name: 'Dresses', slug: 'dresses' },
			{ name: 'Tops', slug: 'tops' },
			{ name: 'Ethnic Wear', slug: 'ethnic-wear' }
		]
	},
	{
		id: 2,
		name: 'Men',
		slug: 'men',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/men.png',
		children: [
			{ name: 'T-Shirts', slug: 't-shirts' },
			{ name: 'Shirts', slug: 'shirts' },
			{ name: 'Jeans', slug: 'jeans' }
		]
	},
	{
		id: 3,
		name: 'Kids',
		slug: 'kids',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/kids.png',
		children: [
			{ name: 'Boys', slug: 'boys' },
			{ name: 'Girls', slug: 'girls' },
			{ name: 'Infants', slug: 'infants' }
		]
	},
	{
		id: 4,
		name: 'Beauty',
		slug: 'beauty',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/beauty.png',
		children: [
			{ name: 'Makeup', slug: 'makeup' },
			{ name: 'Skincare', slug: 'skincare' },
			{ name: 'Haircare', slug: 'haircare' }
		]
	},
	{
		id: 5,
		name: 'Electronics',
		slug: 'electronics',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/electronics.png',
		children: [
			{ name: 'Smartphones', slug: 'smartphones' },
			{ name: 'Laptops', slug: 'laptops' },
			{ name: 'Accessories', slug: 'accessories' }
		]
	},
	{
		id: 6,
		name: 'Home',
		slug: 'home',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/home.png',
		children: [
			{ name: 'Decor', slug: 'decor' },
			{ name: 'Kitchen', slug: 'kitchen' },
			{ name: 'Furniture', slug: 'furniture' }
		]
	}
]

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
	try {
		// For development, return sample data
		// In production, uncomment the following line:
		const categoryService = new CategoryService(fetch)
		const categoriesData = await categoryService.fetchAllCategories()

		// Transform the data to match the desired format
		const transformedCategories = transformCategories(categoriesData.data || [])

		return {
			categories: transformedCategories
		}
	} catch (e) {
		console.error('Error loading categories:', e)
		throw error(400, e?.message || 'Error loading categories')
	}
}

// Helper function to transform categories
function transformCategories(categories) {
	// Create a map to store categories by ID
	const categoryMap = {}

	// First pass: create basic category objects and store in map
	for (const cat of categories) {
		categoryMap[cat.id] = {
			id: cat.id,
			name: cat.name,
			slug: cat.slug || cat.name.toLowerCase(),
			img: cat.thumbnail || `https://s3.ap-south-1.amazonaws.com/litekart.in/categories/${cat.slug || cat.name.toLowerCase()}.png`,
			children: []
		}
	}

	// Second pass: organize into parent-child relationships
	const rootCategories = []

	categories.forEach((cat) => {
		if (cat.parentCategoryId && categoryMap[cat.parentCategoryId]) {
			// This is a child category, add to parent's children array
			const parent = categoryMap[cat.parentCategoryId]
			parent.children.push({
				name: cat.name,
				slug: cat.slug || cat.name.toLowerCase()
			})
		} else {
			// This is a root category
			rootCategories.push(categoryMap[cat.id])
		}
	})

	return rootCategories
}

