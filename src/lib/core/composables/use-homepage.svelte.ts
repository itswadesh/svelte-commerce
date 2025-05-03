import { page } from '$app/state'
import { onMount } from 'svelte'
import { categoryService, orderService, productService } from '$lib/core/services'
import type { Product, Order, ProductStructuredData, Category } from '$lib/core/types'

const getRandomIntervals = (size: number, multiplier = 1000, min = 10000) => {
	let intervals: number[] = []
	for (let i = 0; i < size; i++) {
		intervals.push(Math.floor(Math.random() * multiplier + min))
	}
	return intervals
}

// Define extended interfaces to fix type issues
interface ProductWithVendor extends Product {
	vendor?: {
		businessName: string
	}
	specifications?: {
		material?: string
	}
}

interface PublicOrder {
	id: string
	slug?: string
	first_name?: string
	city?: string
	image?: string
	img?: string
	thumbnail?: string
	title?: string
	created_at?: string
	createdAt?: string
}

export class HomepageModule {
	displayProduct = $state('hidden')
	featuredProducts: ProductWithVendor[] = $state([])
	loadingFeaturedProducts = $state(true)
	hasMoreFeaturedProducts = $state(true)
	currentPage = $state(1)
	loading = $state(true)

	featuredCategories: Category[] = $state([])
	loadingTrendingProducts = $state(true)

	trendingProducts: ProductWithVendor[] = $state([])
	latestOrders: PublicOrder[] = $state([])
	showRecentOrderPopup = $state(false)
	selectedRecentOrder: PublicOrder | null = $state(null)
	randomIntervals = getRandomIntervals(20, 10000, 15000)
	currentInterval = this.randomIntervals[0]
	featuredProductsStructuredData = $state<any[]>([])

	// Initialize product with required fields and mark as $state for reactivity
	product = $state<Partial<Product>>({
		id: '',
		title: '',
		slug: '',
		price: 0
	}) as Product

	constructor() {
		$effect(() => {
			const a = async () => {
				try {
					this.loadingFeaturedProducts = true
					const response = await productService.listFeaturedProducts({
						page: 1,
						sort: '-createdAt'
					})
					this.featuredProducts = (response?.data || []) as unknown as ProductWithVendor[]
					this.currentPage = 2
					this.hasMoreFeaturedProducts = response?.data?.length >= response.pageSize
				} catch (error) {
					console.error('Error loading featured products:', error)
					this.hasMoreFeaturedProducts = false
				} finally {
					this.loadingFeaturedProducts = false
				}
			}
			const b = async () => {
				const response = await productService.listTrendingProducts({ page: 1 })
				this.trendingProducts = (response?.data || []) as unknown as ProductWithVendor[]
				this.loadingTrendingProducts = false
			}
			a()
			b()
			this.getCategoryData()
			// Set recent order popup after 20 seconds
			setTimeout(() => {
				this.showRecentOrderPopup = page?.data?.store?.plugins?.recentPurchasePopup?.active
			}, 20000)
		})

		// let banners: any = $state([])
		onMount(async () => {
			try {
				// const pageData = await PageService.getOne('home')
				// banners = pageData
				this.featuredCategories = (await categoryService.fetchFeaturedCategories({ limit: 18 }))?.data || []
			} catch (e: unknown) {
				console.error(e)
			} finally {
				this.loading = false
			}
		})

		onMount(async () => {
			try {
				const res = await orderService.listPublic()
				if (res?.data) {
					this.latestOrders = res?.data

					const initialInterval = Math.floor(Math.random() * 10000 + 10000)

					if (this.latestOrders.length > 0) {
						this.selectedRecentOrder = this.latestOrders[0]

						setTimeout(() => {
							this.showRecentOrderPopup = true

							setTimeout(() => {
								this.showRecentOrderPopup = false
							}, 10000)
						}, initialInterval)

						setTimeout(() => {
							let i = 0
							const interval = setInterval(() => {
								i++
								if (i >= this.randomIntervals.length || i >= this.latestOrders.length) {
									clearInterval(interval)
									this.showRecentOrderPopup = false
								} else {
									this.currentInterval = this.randomIntervals[i]
									this.selectedRecentOrder = this.latestOrders[i]
									this.showRecentOrderPopup = true

									setTimeout(() => {
										this.showRecentOrderPopup = false
									}, 10000)
								}
							}, this.currentInterval)
						}, initialInterval + 10000)
					}
				}
			} catch (error) {
				console.error(error)
			}
		})

		$effect(() => {
			if (this.featuredProducts?.length) {
				this.featuredProductsStructuredData = this.featuredProducts?.map((product) => {
					// Access business name from product data safely
					const vendorName = product.vendor?.businessName || ''
					return {
						'@context': 'https://schema.org/',
						'@type': 'Product',
						url: `${window.location.origin}/products/${product.slug}`,
						name: product.title,
						image: product.thumbnail ? [product.thumbnail] : [],
						description: product.description || '',
						brandName: vendorName,
						manufacturer: vendorName,
						material: product.specifications?.material || '',
						offers: {
							'@type': 'Offer',
							url: `${window.location.origin}/products/${product.slug}`,
							priceCurrency: page.data?.store?.currency?.code || 'USD',
							price: product.price,
							availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
						}
					}
				})
			}
		})
	}

	getCategoryData = async () => {
		//  resp: any = await CategoryService.fetchFooterCategories({})
		// bannerData = resp?.data.map((item: any) => {
		// 	return {
		// 		src: item.thumbnail,
		// 		alt: item.slug,
		// 		title: item.name,
		// 		link: item.link
		// 	}
		// })
		// cardData = resp?.data.map((item: any) => {
		// 	return {
		// 		src: item.thumbnail,
		// 		title: item.name,
		// 		description: item.description,
		// 		link: item.link,
		// 		overlayText: item.name
		// 	}
		// })
	}

	hideProduct = () => {
		this.displayProduct = 'hidden'
	}

	showProduct = (prod: Product) => {
		this.product = prod
		this.displayProduct = 'flex'
	}

	loadMoreFeaturedProducts = async () => {
		if (this.loadingFeaturedProducts || !this.hasMoreFeaturedProducts) return

		this.loadingFeaturedProducts = true
		try {
			const response = await productService.listFeaturedProducts({
				page: this.currentPage,
				sort: '-createdAt'
			})

			const newProducts = (response?.data || []) as unknown as ProductWithVendor[]
			this.hasMoreFeaturedProducts = response.data.length >= response.pageSize

			this.featuredProducts = [...this.featuredProducts, ...newProducts]
			this.currentPage++
		} catch (error) {
			console.error('Error loading more products:', error)
			this.hasMoreFeaturedProducts = false
		} finally {
			this.loadingFeaturedProducts = false
		}
	}

	// let helloBarPlugin = $state({
	// 	active: false,
	// 	content: ''
	// })

	// $effect(() => {
	// 	if (page?.data?.store?.plugins) {
	// 		const plugin = page?.data?.store?.plugins?.find((plugin: any) => plugin?.code === 'hello-bar')
	// 		helloBarPlugin.active = plugin?.inputs?.active?.val || false

	// 		if (helloBarPlugin.active) {
	// 			helloBarPlugin.content = plugin?.inputs?.content?.val || ''
	// 		}
	// 	}
	// })

	// $effect(() => {
	// 	console.log('featuredProductsStructuredData', $state.snapshot(featuredCategories))
	// })
}

