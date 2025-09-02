import { error } from '@sveltejs/kit'
import type { PageServerLoad } from '../../../../../../routes/(www)/categories/[slug]/$types'

// Sample category detail data
const categoryDetails = {
  women: {
    name: 'Women',
    banner: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-banner.jpg',
    subcategories: [
      {
        name: 'Clothing',
        items: [
          { name: 'Dresses', slug: 'dresses', count: 245 },
          { name: 'Tops & Tees', slug: 'tops-tees', count: 189 },
          { name: 'Ethnic Wear', slug: 'ethnic-wear', count: 167 },
          { name: 'Jeans', slug: 'jeans', count: 98 },
          { name: 'Skirts', slug: 'skirts', count: 76 },
          { name: 'Activewear', slug: 'activewear', count: 112 }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Heels', slug: 'heels', count: 145 },
          { name: 'Flats', slug: 'flats', count: 167 },
          { name: 'Sneakers', slug: 'sneakers', count: 89 },
          { name: 'Boots', slug: 'boots', count: 56 }
        ]
      },
      {
        name: 'Accessories',
        items: [
          { name: 'Bags', slug: 'bags', count: 234 },
          { name: 'Jewelry', slug: 'jewelry', count: 345 },
          { name: 'Watches', slug: 'watches', count: 123 },
          { name: 'Sunglasses', slug: 'sunglasses', count: 78 }
        ]
      },
      {
        name: 'Beauty',
        items: [
          { name: 'Makeup', slug: 'makeup', count: 456 },
          { name: 'Skincare', slug: 'skincare', count: 234 },
          { name: 'Haircare', slug: 'haircare', count: 167 },
          { name: 'Fragrances', slug: 'fragrances', count: 89 }
        ]
      }
    ],
    featuredCollections: [
      {
        name: 'Summer Collection',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-summer.jpg',
        slug: 'summer-collection'
      },
      {
        name: 'Workwear Edit',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-workwear.jpg',
        slug: 'workwear-edit'
      },
      {
        name: 'Party Wear',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-party.jpg',
        slug: 'party-wear'
      }
    ]
  },
  men: {
    name: 'Women',
    banner: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-banner.jpg',
    subcategories: [
      {
        name: 'Clothing',
        items: [
          { name: 'Dresses', slug: 'dresses', count: 245 },
          { name: 'Tops & Tees', slug: 'tops-tees', count: 189 },
          { name: 'Ethnic Wear', slug: 'ethnic-wear', count: 167 },
          { name: 'Jeans', slug: 'jeans', count: 98 },
          { name: 'Skirts', slug: 'skirts', count: 76 },
          { name: 'Activewear', slug: 'activewear', count: 112 }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Heels', slug: 'heels', count: 145 },
          { name: 'Flats', slug: 'flats', count: 167 },
          { name: 'Sneakers', slug: 'sneakers', count: 89 },
          { name: 'Boots', slug: 'boots', count: 56 }
        ]
      },
      {
        name: 'Accessories',
        items: [
          { name: 'Bags', slug: 'bags', count: 234 },
          { name: 'Jewelry', slug: 'jewelry', count: 345 },
          { name: 'Watches', slug: 'watches', count: 123 },
          { name: 'Sunglasses', slug: 'sunglasses', count: 78 }
        ]
      },
      {
        name: 'Beauty',
        items: [
          { name: 'Makeup', slug: 'makeup', count: 456 },
          { name: 'Skincare', slug: 'skincare', count: 234 },
          { name: 'Haircare', slug: 'haircare', count: 167 },
          { name: 'Fragrances', slug: 'fragrances', count: 89 }
        ]
      }
    ],
    featuredCollections: [
      {
        name: 'Summer Collection',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-summer.jpg',
        slug: 'summer-collection'
      },
      {
        name: 'Workwear Edit',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-workwear.jpg',
        slug: 'workwear-edit'
      },
      {
        name: 'Party Wear',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-party.jpg',
        slug: 'party-wear'
      }
    ]
  },
  home: {
    name: 'Women',
    banner: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-banner.jpg',
    subcategories: [
      {
        name: 'Clothing',
        items: [
          { name: 'Dresses', slug: 'dresses', count: 245 },
          { name: 'Tops & Tees', slug: 'tops-tees', count: 189 },
          { name: 'Ethnic Wear', slug: 'ethnic-wear', count: 167 },
          { name: 'Jeans', slug: 'jeans', count: 98 },
          { name: 'Skirts', slug: 'skirts', count: 76 },
          { name: 'Activewear', slug: 'activewear', count: 112 }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Heels', slug: 'heels', count: 145 },
          { name: 'Flats', slug: 'flats', count: 167 },
          { name: 'Sneakers', slug: 'sneakers', count: 89 },
          { name: 'Boots', slug: 'boots', count: 56 }
        ]
      },
      {
        name: 'Accessories',
        items: [
          { name: 'Bags', slug: 'bags', count: 234 },
          { name: 'Jewelry', slug: 'jewelry', count: 345 },
          { name: 'Watches', slug: 'watches', count: 123 },
          { name: 'Sunglasses', slug: 'sunglasses', count: 78 }
        ]
      },
      {
        name: 'Beauty',
        items: [
          { name: 'Makeup', slug: 'makeup', count: 456 },
          { name: 'Skincare', slug: 'skincare', count: 234 },
          { name: 'Haircare', slug: 'haircare', count: 167 },
          { name: 'Fragrances', slug: 'fragrances', count: 89 }
        ]
      }
    ],
    featuredCollections: [
      {
        name: 'Summer Collection',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-summer.jpg',
        slug: 'summer-collection'
      },
      {
        name: 'Workwear Edit',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-workwear.jpg',
        slug: 'workwear-edit'
      },
      {
        name: 'Party Wear',
        image: 'https://s3.ap-south-1.amazonaws.com/litekart.in/categories/women-party.jpg',
        slug: 'party-wear'
      }
    ]
  }
  // Add other categories here
}

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { slug } = params
    const category = categoryDetails[slug]

    // const fetchAllCategories = await CategoryService.fetchAllCategories()
    // 
    // const category =await CategoryService.fetchCategory("category_01JKQG041AQTKYK1P529FTJXQ4")
    // 

    if (!category) {
      throw error(404, 'Category not found')
    }

    return {
      category
    }
  } catch (e) {
    console.error('Error loading category:', e)
    throw error(e.status || 400, e?.message || 'Error loading category')
  }
}
