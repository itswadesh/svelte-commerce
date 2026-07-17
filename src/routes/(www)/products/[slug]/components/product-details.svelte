<script lang="ts">
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import {
		SeoHeader,
		GoogleStructuredDataBreadcrumb,
		GoogleStructuredDataProduct,
		GoogleStructuredVideoSchema
	} from '$lib/core/components/index.js'
	import PincodeCheck from '$lib/components/product-catalogue/pincode-check.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Truck } from '@lucide/svelte'
	import ProductAggregation from './product-aggregation.svelte'
	import ProductCartAndWishlistButtons from './product-cart-and-wishlist-buttons.svelte'
	import ProductDescription from './product-description.svelte'
	import ProductGallerySection from './product-gallery-section.svelte'
	import ProductMetaDataSection from './product-meta-data-section.svelte'
	import ProductPricing from './product-pricing.svelte'
	import ProductReviewsSection from './product-reviews-section.svelte'
	import ProductSpecifications from './product-specifications.svelte'
	import ProductTags from './product-tags.svelte'
	import ProductTitleSection from './product-title-section.svelte'
	import ProductVariation from './product-variation.svelte'
	import RelatedProducts from './related-products.svelte'
	import StoreCheck from './store-check.svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()
  const data = $derived(page.data)
  const showPincodeCheck = $derived(productState.wareHousePluginEnabled && productState.isIndianPincodesPluginEnabled)

	/** Strip HTML tags and collapse whitespace; returns '' for placeholder-only values like "-". */
	const cleanHtmlText = (value: string | null | undefined): string => {
		const text = String(value ?? '')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
		return /^[\s\-–—._,]*$/.test(text) ? '' : text
	}

	// Feed data sometimes carries placeholder descriptions ("-"); never surface them in meta tags.
	const metaDescription = $derived.by(() => {
		const provided = cleanHtmlText(data?.product?.metaDescription)
		if (provided) return provided
		const description = cleanHtmlText(data?.product?.description)
		if (data?.product?.title && description) {
			return `${data.product.title}. ${description.slice(0, 160)}... Discover premium quality ${data.product.title} at Arialshop. Enjoy free delivery on orders over ₹999 and easy 7-day returns. Shop now!`
		}
		return `Discover premium quality products at Arialshop. Enjoy free delivery on orders over ₹999 and easy 7-day returns. Shop now!`
	})

	// Video URLs mixed into the product image list (YouTube or hosted mp4/webm) get a VideoObject schema.
	const productVideoUrls = $derived(
		productState.productImagesArray?.filter(
			(img: string) => img.includes('youtube.com') || img.includes('youtu.be') || img.endsWith('.mp4') || img.endsWith('.webm')
		) || []
	)

	// GA4 view_item — fires once per product (also on client-side navigation). Reads
	// window.gtag at call time (defined by the GoogleAnalytics loader in the root layout,
	// driven by the store's googleTagManager plugin); safe no-op when analytics is off.
	const trackViewItem = (p: Record<string, any>, currency?: string) => {
		if (typeof window === 'undefined') return
		const g = (window as any).gtag
		if (typeof g !== 'function') return
		try {
			g('event', 'view_item', {
				currency,
				value: p?.price,
				items: [
					{
						item_id: p?.sku ?? p?.id,
						item_name: p?.title ?? p?.name,
						item_brand: p?.brandName ?? p?.brand?.name,
						item_category: p?.category?.name ?? p?.category,
						price: p?.price,
						quantity: 1,
						...(currency ? { currency } : {})
					}
				]
			})
		} catch {
			/* never let analytics break the app */
		}
	}

	let lastViewedProductId = ''
	$effect(() => {
		const p = page.data.product
		if (p?.id && p.id !== lastViewedProductId) {
			lastViewedProductId = p.id
			trackViewItem(p, page.data.store?.currency?.code)
		}
	})
</script>

<SeoHeader
	metaTitle={data?.product?.metaTitle || `${data?.product?.title} — Buy Online at Arialshop | Free Delivery`}
	metaDescription={metaDescription}
	metaKeywords={data?.product?.keywords || ''}
	image={data?.product?.thumbnail || ''}
/>

<GoogleStructuredDataProduct
	product={{
		...productState.structuredData,
		gtin13: data?.product?.barcode,
		weight: data?.product?.weight,
		category: data?.product?.category?.name || data?.product?.category
	}}
/>

<GoogleStructuredDataBreadcrumb
  breadcrumbs={data?.product?.categoryHierarchy?.map((item: any, index: number) => ({
  name: item.name,
  item: index === data?.product?.categoryHierarchy?.length - 1 ? undefined : `${page.url.origin}${item.slug}`
  })) || []}
/>

{#if data?.product}
	{#each productVideoUrls as videoUrl}
		<GoogleStructuredVideoSchema
			name={data.product.title}
			description={cleanHtmlText(data.product.description) || data.product.title}
			thumbnailUrl={data.product.thumbnail}
			uploadDate={data.product.updatedAt || new Date().toISOString()}
			embedUrl={videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? videoUrl : undefined}
			contentUrl={videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') ? videoUrl : undefined}
		/>
	{/each}
{/if}

<!-- <ProductRenderer bind:data>
{#snippet content(productState)} -->
<div class="intra-pt page-width hidden md:block">
	<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
</div>

<div class="page-width intra-gap flex flex-col ">
	{#if !data?.product && !productState.isLoading}
		<div class="flex h-96 flex-col items-center justify-center space-y-4">
			<h2 class="page-heading">Product not found</h2>
			<a href="/products" class="text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Browse All Products</a>
		</div>
	{:else}
		<div class="inter-gap relative grid grid-cols-1 items-start lg:grid-cols-2">
			<div class="col-span-1 sm:mt-0 ">
				<ProductGallerySection />
			</div>

      <div class="block md:hidden">
        <Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
      </div>

			<div class="intra-gap top-28 mx-0 lg:pl-6 flex flex-col space-y-0">
				<ProductTitleSection product={data?.product} />

				<ProductPricing />

				<ProductAggregation />

				<div class="intra-gap flex flex-col">
					<ProductVariation />

					<!-- Desktop Cart Button -->
					<div class="intra-gap hidden flex-col sm:flex mt-2">
						<ProductCartAndWishlistButtons />
					</div>

					{#if showPincodeCheck}
						<div class="intra-gap border-t intra-pt flex flex-col">
							<div class="intra-gap flex items-center justify-start">
								<Truck class="size-4 text-gray-900" />
								<span class="text-sm  text-gray-900">
									Delivery Options
								</span>
							</div>
							<PincodeCheck />
						</div>
					{:else}
						<!-- Fallback delivery estimate when plugin is not enabled -->
						<!-- <div class="intra-gap border-t border-gray-100 intra-pt flex flex-col">
							<div class="flex items-center gap-2">
								<Truck class="size-4 text-gray-900" />
								<span class="text-base font-bold text-gray-900">Delivery Information</span>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-gray-700">Free delivery on orders above ₹999</p>
								<p class="text-[11px] font-bold uppercase tracking-tight text-gray-400">
									Estimated delivery: 5-7 business days
								</p>
							</div>
						</div> -->
					{/if}

					{#if productState.trustBadgesPlugin?.active}
						<div class="border-t border-gray-100 intra-pt">
							{@html productState.trustBadgesPlugin?.html}
						</div>
					{/if}

					{#if productState.returnPlugin && productState.returnPlugin?.active && productState.returnPlugin?.html}
						<div class="">
							  <h3 class="mb-2 text-base font-bold text-gray-900">Returns & Exchanges</h3>
							<div
								class="text-sm leading-relaxed text-gray-600 {!productState.showReturnPolicy
									? 'line-clamp-2 overflow-hidden'
									: ''}"
							>
								{@html productState.returnPlugin?.html}
							</div>

							{#if productState.returnPlugin?.below_more}
								<Button
									variant="link"
									class="h-auto p-0 mt-1"
									onclick={() => (productState.showReturnPolicy = !productState.showReturnPolicy)}
								>
									{productState.showReturnPolicy ? 'Show Less' : 'Read Full Policy'}
								</Button>
							{/if}
						</div>
					{:else}
						<!-- Fallback return policy when plugin is not configured -->
						<!-- <div class="">
							<h3 class="mb-2 text-base font-bold text-gray-900">Returns & Exchanges</h3>
							<p class="text-sm leading-relaxed text-gray-600">
								We accept returns within 7 days of delivery for unused items in original packaging.
							</p>
						</div> -->
					{/if}

					<div class="">
						<StoreCheck />
						<ProductSpecifications />
						<ProductDescription />
					</div>

					<ProductMetaDataSection />
				</div>

				<ProductTags />
			</div>
		</div>
	{/if}

	<ProductReviewsSection />

	<div class="">
		<RelatedProducts />
	</div>
</div>

<!-- Mobile cart button - Sticky Footer -->
<div
	class="sticky inset-x-0 bottom-0 flex w-full items-center gap-3 border-t border-gray-100 bg-white/95 p-page shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md sm:hidden"
>
	<div class="flex-1 flex flex-col intra-gap">
		<ProductCartAndWishlistButtons showWishlist={false} />
	</div>
</div>

<LoginModal bind:show={productState.showLoginModal} />

<EnquiryModal
	isOpen={productState.showEnquiryModal}
	productId={data?.product?.id}
	productTitle={data?.product?.title}
	onClose={() => (productState.showEnquiryModal = false)}
/>
<!-- {/snippet}
</ProductRenderer> -->
