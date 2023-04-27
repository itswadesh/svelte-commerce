import type { AllOrders, AllProducts, Category, Order, Product } from '$lib/types'
export const mapBigcommerceProducts = (b) => {
	if (b) {
		b.images = b.images.map((i) => i.url_standard)
		const prod = {
			id: b.id,
			name: b.name,
			type: b.type,
			sku: b.sku,
			description: b.description,
			images: b.images,
			weight: b.weight,
			width: b.width,
			depth: b.depth,
			height: b.height,
			price: b.price,
			mrp: b.cost_price,
			categories: b.categories,
			brandId: b.brand_id,
			stock: b.inventory_level,
			averageRating: b.reviews_rating_sum,
			totalReviews: b.reviews_count,
			approved: b.is_visible,
			featured: b.is_featured,
			related_products: b.related_products,
			warranty: b.warranty,
			upc: b.upc,
			mpn: b.mpn,
			gtin: b.gtin,
			keywords: b.keywords,
			availability: b.availability,
			sort: b.sort_order,
			condition: b.condition,
			title: b.page_title,
			metaKeywords: b.meta_keywords,
			metaDescription: b.meta_description,
			createdAt: b.date_created,
			updatedAt: b.date_modified,
			popularity: b.view_count,
			img: null
		}
		prod.img = b.images[0]
		return prod
	} else {
		return {}
	}
}
