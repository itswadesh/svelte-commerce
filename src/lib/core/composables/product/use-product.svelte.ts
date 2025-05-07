import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/state'
import type { CarouselAPI } from '$lib/components/ui/carousel/context'
import { storeProductToRecentlyViewed } from '$lib/core/logic/products.helper'
import { findVariantWithOptionValue } from '$lib/core/logic/variants.helper'
import { addPendingWishlistAction, checkPendingWishlistActions } from '$lib/core/logic/wishlist.helper'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { getCartState } from '$lib/core/stores/cart.svelte'
import { getSettingState } from '$lib/core/stores/setting.svelte'
import { deepCopy } from '$lib/core/utils'
import { fireGTagEvent } from '$lib/core/utils/gtag'
import { meilisearchService, productService, reviewService, wishlistService } from '@misiki/litekart-connector'
import { getContext, onMount, setContext, untrack } from 'svelte'
import { toast } from 'svelte-sonner'

const PRODUCT_STATE_KEY = Symbol('product-state')

class ProductState {
	data: any = {}

	ADD_TO_CART_MESSAGE_DURATION = 10000

	settingState = getSettingState()
	userState = getUserState()
	cartState = getCartState()

	isAdding = $state(false)
	showReviewForm = $state(false)
	ratingLabels = {
		0: { text: 'Very Disappointed', color: 'text-red-600' },
		1: { text: 'Slightly Disappointed', color: 'text-orange-600' },
		2: { text: 'Good', color: 'text-green-600' },
		3: { text: 'Very Good', color: 'text-green-600' },
		4: { text: 'Excellent', color: 'text-green-600' }
	}
	qty = $state(1)
	isLoading = $state(true)
	allRatings = $state(null)
	productsOfSameCategory = $state([])
	isLoadingRatings = $state(false)
	isLoadingRelatedProducts = $state(false)
	relatedProducts = $state({})
	displayCarousel = $state('hidden')
	selectedImage = $state(this.data?.product?.thumbnail || '')
	selectedVariant: any = $state({})
	viewPortCartPositionFromTop = $state(0)
	select: number | null = $state(null)
	reviewMessage = $state('')
	uploading = $state(false)
	uploadedImagestoSave = $state([''])
	showDescription = $state(false)
	returnPlugin = $derived(this.data?.store?.plugins?.returnAndExchange)
	showReturnPolicy = $state(this.data?.store?.plugins?.returnAndExchange?.below_more === true ? false : true)
	showAddToCartMessage = $state(false)
	single = true
	showLoginModal = $state(false)
	showSimilarDrawer = $state<boolean>(false)
	selectedAggregations = $state<Record<string, string>>({})

	carousel: HTMLDivElement | null = null
	carouselApi: CarouselAPI | null = $state(null)
	currentIndex = $state(0)

	structuredData: any = $state({})
	showEnquiryModal = $state(false)

	anyVariantStockThere = $derived(this.data?.product?.variants?.some((v) => (v.stock || 0) > 0))

	trustBadgesPlugin = $derived(this.data?.store?.plugins?.trustBadges)

	productImagesArray = $state(
		this.data?.product?.images?.split(',').map((i) => {
			return i.trim()
		}) || []
	)

	carouselImages = $state(this.productImagesArray)

	productOptions: any[] = $state(this.data?.product?.options || [])

	images = $state([])
	uploadedImages = $state([])

	wishlistPluginEnabled = $derived(page?.data?.store?.plugins?.isWishlist?.active)
	isIndianPincodesPluginEnabled = $derived(page?.data?.store?.plugins?.isIndianPincodes?.active)
	wareHousePluginEnabled = $derived(page?.data?.store?.plugins?.warehouse?.active)

	wishlisted = $state(false)
	wishlistLoading = $state(false)

	warehouses = $state<Record<string, unknown>[]>([])

	refreshOptions = () => {
		if (this.data?.product?.options?.length) {
			this.productOptions = this.data.product.options.map((option) => {
				option.values = option.values?.map?.((_value: any) => {
					_value.selectable = true
					return _value
				})
				return option
			})
		}
	}

	onSelect(i) {
		this.select = i
	}

	// TODO: can we improve this
	isAggregationAvaliable = (optionName: string, value: string) => {
		return !!this.data?.product?.pg?.find((product: Record<string, string>) => {
			return Object.entries({ ...this.selectedAggregations, [optionName]: value }).every(([key, val]) => {
				return product[key] === val
			})
		})
	}

	toggleAggregation = async (optionName: string, value: string) => {
		if (!this.isAggregationAvaliable(optionName, value)) this.selectedAggregations = { [optionName]: value }
		else if (this.selectedAggregations[optionName] === value) delete this.selectedAggregations[optionName]
		else this.selectedAggregations = { ...this.selectedAggregations, [optionName]: value }

		const matchingProduct = this.data?.product?.pg?.find((product) => {
			return Object.entries(this.selectedAggregations).every(([key, val]) => {
				return product[key] === val
			})
		})

		/* This case is when user selects a disabled option */
		if (Object.keys(this.selectedAggregations).length === 1) {
			const allKeys = Object.keys(this.data.product?.ag || {})
			const selectedKey = Object.keys(this.selectedAggregations)[0]
			const otherKeys = allKeys.filter((key) => key !== selectedKey)

			for (const key of otherKeys) {
				const value = matchingProduct?.[key]
				value && (this.selectedAggregations[key] = value)
			}
		}

		if (matchingProduct?.id) {
			this.data.product.id = matchingProduct.id
		}

		if (matchingProduct?.slug) {
			await goto(`/products/${matchingProduct.slug}?variant_id=${matchingProduct.variantId}`, { replaceState: true })

			setTimeout(() => {
				if (this.data?.product?.images) {
					this.productImagesArray = []
					// carouselImages = [];

					// const newImagesArray = this.data.product.images.split(",").map(i => i.trim());
					const newImagesArray = this.data.product.images.split(',').map((i) => i.trim())
					this.productImagesArray = newImagesArray
					// carouselImages = newImagesArray;
					this.selectedImage = this.data.product.thumbnail || ''

					this.currentIndex = 0
					if (this.carouselApi) {
						this.carouselApi.scrollTo(0)
					}
				}
			}, 100)
		}
	}

	mount = async () => {
		this.isLoading = true

		this.findAndSelectVariantFromSearchParam()

		browser && (await storeProductToRecentlyViewed({ product: this.data?.product, variant: this.selectedVariant }))

		this.isLoading = false
		this.relatedProducts = await productService.listRelatedProducts({ page: 1, categoryId: this.data?.product?.categoryId })
	}

	findAndSelectVariantFromSearchParam = () => {
		if (this.data?.product?.variants?.length) {
			const variantId = page.url.searchParams.get('variant_id')
			if (variantId && variantId !== '') {
				this.selectedVariant = this.data?.product.variants.find((v) => v.id === variantId)
			} else {
				this.selectedVariant = this.data?.product?.variants?.find((v) => v.title == 'default') || this.data?.product?.variants[0]
				goto(`?variant_id=${this.selectedVariant?.id || ''}`, { replaceState: true })
			}
		}
	}

	selectVariant = async ({ option, value }: { option: any; value: any }) => {
		if (this.data?.product?.variants) {
			this.selectedVariant = findVariantWithOptionValue(this.data?.product.variants, {
				optionId: option.id,
				value: value.value,
				selectedVariant: this.selectedVariant
			})

			// Mark options that are not selectable
			if (this.data?.product?.options) {
				this.productOptions = this.data.product.options.map((option) => {
					option.values = option.values.map((_value: any) => {
						_value.selectable = this.isOptionSelectable(option.id, _value.value, option.id, value.value)
						return _value
					})
					return option
				})
			}

			if (this.selectedVariant?.id) goto(`?variant_id=${this.selectedVariant?.id || ''}`)
		}
	}

	isOptionSelectable = (optionId: string, value: string, clickedOptionId: string, clickedValue: string) => {
		if (!this.selectedVariant?.options) return true
		if (optionId === clickedOptionId) return true

		// Check if the option is selectable by checking if the option is already selected
		const f = this.data?.product?.variants?.find?.((v) => {
			const isVariantHavingClickedOption = v?.options?.some?.((option) => option.optionId === clickedOptionId && option.value === clickedValue)
			const isVariantHavingOption = v?.options?.some?.((option) => option.optionId === optionId && option.value === value)
			return isVariantHavingClickedOption && isVariantHavingOption
		})

		return !!f
	}

	isVariantOptionSelected = (optionId: string, value: string) => {
		return this.selectedVariant?.options?.some((option: Record<string, any>) => option.value === value && option.optionId === optionId)
	}

	handleImageChange = async (event: Event) => {
		if (this.uploading) return
		this.uploading = true

		const target = event.target as HTMLInputElement
		if (target.files?.length) {
			let newImages = Array.from(target.files)
			if (single) {
				newImages = [newImages[0]]
				this.images = newImages
				this.uploadedImages = []
				// console.log(newImages, images)
			} else {
				this.images = [...this.images, ...newImages]
			}
			// console.log(newImages)
			for (const image of newImages) {
				await image
			}
		}

		this.uploading = false // Reset uploading flag after processing all images
	}

	removeSelectedImage = (path: string) => {
		this.uploadedImagestoSave = this.uploadedImagestoSave.filter((t) => t !== path)
	}

	checkIfWishlisted = async (id: string) => {
		if (!id) return

		if (!this.userState?.user?.userId) {
			return
		}

		try {
			const res = await wishlistService.checkWishlist({
				productId: this.data?.product?.id,
				variantId: this.selectedVariant?.id
			})

			return res
		} catch (error) {
			console.log(error)
		}
	}

	handleWishlistClick = async () => {
		if (!this.userState?.user?.userId) {
			addPendingWishlistAction({
				productId: this.data?.product?.id,
				variantId: this.selectedVariant?.id || ''
			})

			this.showLoginModal = true
			toast.error('Please login to add to wishlist', { position: 'top-right' })
			return
		}

		if (this.userState?.user?.role !== 'USER') {
			toast.error('Only users can add to wishlist', { position: 'top-right' })
			return
		}

		this.wishlistLoading = true
		try {
			const res = await wishlistService.toggleWishlist({
				productId: this.data?.product?.id,
				variantId: this.selectedVariant?.id
			})

			if (res?.id) {
				this.wishlisted = res?.active
			} else {
				this.wishlisted = false
			}
		} catch (error) {
			console.log(error)
		} finally {
			this.wishlistLoading = false
		}
	}

	setState = (data: any) => {
		data && (this.data = data)

		if (this.data?.product?.variants?.length) {
			const variantId = page.url.searchParams.get('variant_id')
			if (variantId) {
				this.selectedVariant = this.data?.product.variants.find((v) => v.id === variantId)
			} else {
				this.selectedVariant = this.data?.product?.variants?.find((v) => v.title !== 'default')
			}
		}
	}

	getState = () => {
		return this.data
	}

	constructor(data: any) {
		this.data = data

		onMount(async () => {
			await this.mount()
			fireGTagEvent('view_item', { ...this.data.product, qty: 1 })
		})

		$effect(() => {
			if (this.userState?.user?.userId) {
				checkPendingWishlistActions(this.userState?.user?.userId)
					.then((value) => {
						this.wishlisted = value || false
						value && toast.success('Item added to wishlist')
					})
					.catch()
			}
		})

		$effect(() => {
			if (this.selectedVariant?.id || this.data?.product?.id) {
				this.checkIfWishlisted(this.selectedVariant?.id || this.data?.product?.id)
					.then((val) => {
						this.wishlisted = val || false
					})
					.catch((err) => {
						console.log(err)
					})
			}
		})

		onMount(async () => {
			// Load ratings and related products after the main content is displayed (lazy loading)

			// Load product ratings
			this.isLoadingRatings = true
			try {
				const ratingsResponse = await reviewService.allReviews({})
				this.allRatings = ratingsResponse.data
			} catch (error) {
				console.error('Error loading ratings:', error)
			} finally {
				this.isLoadingRatings = false
			}

			// Load related products from same category
			const categorySlug = this.data?.product?.categoryHierarchy?.[this.data?.product?.categoryHierarchy?.length - 1]?.slug
			if (categorySlug) {
				this.isLoadingRelatedProducts = true
				try {
					const result = await meilisearchService.search({ categories: categorySlug, query: '' })
					this.productsOfSameCategory = result?.hits?.filter((x) => x.id !== this.data?.product?.id) || []
				} catch (error) {
					console.error('Error loading related products:', error)
				} finally {
					this.isLoadingRelatedProducts = false
				}
			}
		})

		onMount(async () => {
			try {
				const res = await fetch(`/api/inventory/${this.data?.product?.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'x-litekart-store': page.data?.store?.id || ''
					}
				})

				const jsonRes = await res.json()
				if (jsonRes?.data?.length) {
					this.warehouses = jsonRes.data
				}

				console.log(res, 'res')
			} catch (error) {
				console.error(error)
			}
		})

		$effect(() => {
			if (this.data?.product) {
				this.structuredData = {
					name: this.data?.product?.title,
					image: [this.data?.product?.thumbnail],
					description: this.data?.product?.description,
					sku: this.data?.product?.sku,
					brandName: this.data?.product?.vendorId,
					aggregateRating: {
						ratingValue: this.data?.product?.rating,
						reviewCount: this.data?.product?.reviewCount
					},
					url: page.url.href,
					priceCurrency: page?.data?.store?.currency?.code,
					price: this.data?.product?.price,
					availability: this.data?.product?.stock > 0 ? 'InStock' : 'OutOfStock'
				}
			}
		})

		$effect(() => {
			if (this.data?.product?.images) {
				this.productImagesArray = this.data?.product?.images?.split(',').map((i) => {
					return i.trim()
				})
				this.selectedImage = this.data?.product?.thumbnail || ''
			}
			productService
				.listRelatedProducts({ page: 1, categoryId: this.data?.product?.categoryId })
				.then((data) => {
					this.relatedProducts = deepCopy(this.data)
				})
				.catch((err) => {
					console.log(err)
				})

			// if (carousel) {
			// 	carousel.addEventListener('scroll', () => {
			// 		// Update currentIndex when carousel scrolls
			// 		currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth)
			// 		if (this.productImagesArray && this.productImagesArray[currentIndex]) {
			// 			this.selectedImage = this.productImagesArray[currentIndex]
			// 		}
			// 	})
			// }
		})
		$effect(() => {
			// Mark all options as selectable at initial render
			if (this.data?.product?.options?.length) {
				this.refreshOptions()
			} else {
				this.productOptions = []
			}
		})

		$effect(() => {
			if (this.data?.product?.pg && this.data?.product?.slug) {
				const currentProduct = this.data.product.pg.find((p) => p.slug === this.data.product.slug)

				if (currentProduct) {
					const newSelectedAggregations = {}
					Object.entries(this.data.product.ag || {}).forEach(([key]) => {
						if (currentProduct[key]) {
							newSelectedAggregations[key] = currentProduct[key]
						}
					})
					this.selectedAggregations = newSelectedAggregations
				}
			}
		})

		// TODO: Due to this effect, the selected variant is updated two times causing an extra render
		// Try to find a way to avoid this
		// This effect is used to set the selected variant when the page is loaded or when navigating
		// to and back from other product page
		// Can we use onNavigate() instead of this effect? but its interfering with the variant selection
		// by overwriting the selected variant as we are using goto() for variant selection
		// $effect(() => {
		// 	console.log('variant effect')
		// 	if (this.data && this.data?.product?.variants) {
		// 		const variantId = page.url.searchParams.get('variant_id')
		// 		console.log('variantId', variantId)
		// 		if (variantId) {
		// 			this.selectedVariant = this.data?.product.variants.find((v) => v.id === variantId)
		// 		} else {
		// 			this.selectedVariant = this.data?.product?.variants?.find((v) => v.title !== 'default')
		// 		}
		// 	}
		// })
	}
}

export function createProductStateContext(initialState = {}) {
	const productState = new ProductState(initialState)

	setContext(PRODUCT_STATE_KEY, productState)
	return productState
}

export function useProductState() {
	const productState = getContext(PRODUCT_STATE_KEY) as ProductState
	if (!productState) {
		throw new Error('useProductState must be used within a ProductStateProvider')
	}
	return productState
}
