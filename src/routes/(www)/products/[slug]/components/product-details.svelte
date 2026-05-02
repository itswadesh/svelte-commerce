<script lang="ts">
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import GoogleStructuredDataProduct from '$lib/core/components/plugins/google-structured-data-product.svelte'
	import GoogleStructuredDataBreadcrumb from '$lib/core/components/plugins/google-structured-data-breadcrumb.svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
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
	//import { PUBLIC_LITEKART_DOMAIN } from '$env/static/public'
  const PUBLIC_LITEKART_DOMAIN = $derived(page.url.origin)


	const productState = useProductState()
	const data = $derived(page.data)
</script>

<SeoHeader
	metaTitle={data?.product?.metaTitle || `${data?.product?.title} — Buy Online at Arialshop | Free Delivery`}
	metaDescription={data?.product?.metaDescription || `${data?.product?.title}. ${data?.product?.description?.replace(/<[^>]*>?/gm, '').slice(0, 160)}... Discover premium quality ${data?.product?.title} at Arialshop. Enjoy free delivery on orders over ₹999 and easy 7-day returns. Shop now!`}
	metaKeywords={data?.product?.keywords || ''}
	image={data?.product?.thumbnail || ''}
/>

<GoogleStructuredDataProduct product={productState.structuredData} />

<!-- <ProductRenderer bind:data>
	{#snippet content(productState)} -->
<div class="mx-2 mb-3 mt-2 lg:container lg:mx-auto">
	<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
	<GoogleStructuredDataBreadcrumb breadcrumbs={data?.product?.categoryHierarchy?.map((item: any, index: number) => ({
		name: item.name,
		item: index === data?.product?.categoryHierarchy?.length - 1 ? undefined : `https://${PUBLIC_LITEKART_DOMAIN}${item.slug}`
	})) || []} />
</div>

<div class="lg:container lg:mx-auto px-4">
	{#if !data?.product && !productState.isLoading}
		<div class="flex h-96 flex-col items-center justify-center space-y-4">
			<h2 class="text-2xl font-bold text-gray-900">Product not found</h2>
			<a href="/products" class="text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Browse All Products</a>
		</div>
	{:else}
		<div class="relative grid grid-cols-1 items-start lg:grid-cols-3 lg:gap-12 pb-12">
			<div class="col-span-2 sm:mt-0">
				<ProductGallerySection />
			</div>

			<div class="sticky top-24 mx-0 flex flex-col space-y-0">
				<ProductTitleSection product={data?.product} />

				<ProductPricing />

				<ProductAggregation />

				<div class="flex flex-col">
					<ProductVariation />

					<!-- Desktop Cart Button -->
					<div class="hidden sm:block mt-4">
						<ProductCartAndWishlistButtons />
					</div>

					{#if productState.isIndianPincodesPluginEnabled}
						<div class="flex flex-col gap-3 my-1 pt-6 border-t border-gray-100">
							<div class="flex items-center justify-start gap-3">
								<Truck class="h-4 w-4 text-gray-900" />
								<span class="text-sm font-bold uppercase tracking-widest text-gray-900"> Delivery Options </span>
							</div>
							<PincodeCheck />
						</div>
					{:else}
						<!-- Fallback delivery estimate when plugin is not enabled -->
						<div class="flex flex-col gap-3 my-1 pt-6 border-t border-gray-100">
							<div class="flex items-center gap-3">
								<Truck class="h-4 w-4 text-gray-900" />
								<span class="text-sm font-bold uppercase  text-gray-900">Delivery Information</span>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-gray-700">Free delivery on orders above ₹999</p>
								<p class="text-[11px] font-bold uppercase tracking-tight text-gray-400">Estimated delivery: 5-7 business days</p>
							</div>
						</div>
					{/if}

					{#if productState.trustBadgesPlugin?.active}
						<div class="border-t border-gray-100 py-5">
							{@html productState.trustBadgesPlugin?.html}
						</div>
					{/if}

					{#if productState.returnPlugin && productState.returnPlugin?.active && productState.returnPlugin?.html}
						<div class="border-t border-gray-100 py-5">
							<div class="flex items-center gap-3 mb-3">
								<span class="text-sm font-bold uppercase  text-gray-900">Returns & Exchanges</span>
							</div>
							<div class="text-sm text-gray-600 leading-relaxed {!productState.showReturnPolicy ? 'line-clamp-2 overflow-hidden' : ''}">
								{@html productState.returnPlugin?.html}
							</div>

							{#if productState.returnPlugin?.below_more}
								<button
									class="mt-1 text-[10px] font-bold uppercase  text-primary hover:underline transition-all"
									onclick={() => (productState.showReturnPolicy = !productState.showReturnPolicy)}
								>
									{productState.showReturnPolicy ? 'Show Less' : 'Read Full Policy'}
								</button>
							{/if}
						</div>
					{:else}
						<!-- Fallback return policy when plugin is not configured -->
						<div class="border-t border-gray-100 py-5">
							<h3 class="mb-2 text-sm font-bold uppercase text-gray-900">Returns & Exchanges</h3>
							<p class="text-sm text-gray-600 leading-relaxed">
								We accept returns within 7 days of delivery for unused items in original packaging.
							</p>
						</div>
					{/if}

					<div class="border-t border-gray-100 pt-4">
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

	<div class="border-t border-gray-100 pt-16">
		<ProductReviewsSection />
	</div>

	<div class="pt-16">
		<RelatedProducts />
	</div>
</div>

<!-- Mobile cart button - Sticky Footer -->
<div class="sticky inset-x-0 bottom-0 z-[60] flex w-full items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-4 border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] sm:hidden">
	<div class="flex-1">
		<ProductCartAndWishlistButtons />
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
