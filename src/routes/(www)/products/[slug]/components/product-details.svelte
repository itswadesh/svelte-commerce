<script lang="ts">
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import GoogleStructuredDataProduct from '$lib/core/components/plugins/google-structured-data-product.svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import PincodeCheck from '$lib/components/product-catalogue/pincode-check.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { useProductState } from '$lib/core/composables/product'
	import { Truck } from 'lucide-svelte'
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

	const productState = useProductState()
	const data = $derived(productState.data)
</script>

<SeoHeader
	metaTitle={data?.product?.metaTitle || data?.product?.title}
	metaDescription={data?.product?.metaDescription || ''}
	metaKeywords={data?.product?.keywords || ''}
	image={data?.product?.thumbnail || ''}
/>

<GoogleStructuredDataProduct product={productState.structuredData} />

<!-- <ProductRenderer bind:data>
	{#snippet content(productState)} -->
<div class="mx-2 mb-3 mt-2 hidden lg:container lg:mx-auto lg:block">
	<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
</div>

<div class="lg:container lg:mx-auto">
	{#if !data?.product && !productState.isLoading}
		<h2 class="text-center">Product not found</h2>
	{:else}
		<div class="relative grid grid-cols-1 items-start lg:grid-cols-3 lg:gap-6">
			<div class="col-span-2 sm:mt-0">
				<ProductGallerySection />
			</div>

			<div class="sticky top-20 mx-2 grid gap-2 sm:gap-5">
				<ProductTitleSection product={productState.data?.product} />

				<ProductPricing />

				<ProductAggregation />

				<div class="">
					<!-- <p>{data?.product.brand} / {data?.product.category}</p> -->

					<ProductVariation />

					<br class="max-sm:hidden" />

					<!-- {#if settingState?.plugins?.enquiryMode}
			<Button
				class="w-full mb-4"
				onclick={(e: MouseEvent) => showEnquiryModal = true}
			>
				Enquire Now
			</Button>
		{/if} -->

					<!-- Desktop Cart Button -->
					<div class="hidden sm:block">
						<ProductCartAndWishlistButtons />
					</div>

					<br class="max-sm:hidden" />
					{#if productState.isIndianPincodesPluginEnabled}
						<div class="flex flex-col gap-3 max-sm:my-5">
							<div class="flex items-center justify-start gap-3">
								<span class="text-sm text-gray-500"> Delivery Options </span>
								<Truck class="h-4 w-4 text-gray-500" />
							</div>
							<PincodeCheck />
						</div>
						<br class="max-sm:hidden" />
					{/if}

					{#if productState.trustBadgesPlugin?.active}
						<div class="border-t border-gray-200">
							{@html productState.trustBadgesPlugin?.html}
						</div>
					{/if}

					{#if productState.returnPlugin && productState.returnPlugin?.active && productState.returnPlugin?.html}
						<div class="border-t border-gray-200">
							<div class={!productState.showReturnPolicy ? 'line-clamp-3 overflow-hidden' : ''}>
								{@html productState.returnPlugin?.html}
							</div>

							{#if productState.returnPlugin?.below_more}
								{#if !productState.showReturnPolicy}
									<button
										class="inline-block cursor-pointer text-start text-sm text-primary underline"
										onclick={() => (productState.showReturnPolicy = true)}
									>
										Show more
									</button>
								{:else}
									<button
										class="inline-block cursor-pointer text-start text-sm text-primary underline"
										onclick={() => (productState.showReturnPolicy = false)}
									>
										Show less
									</button>
								{/if}
							{/if}
						</div>
					{/if}

					<StoreCheck />

					<ProductSpecifications />

					<ProductDescription />

					<!-- Mobile cart button -->
					<div class="sticky inset-x-0 bottom-0 z-50 flex h-16 w-full items-center gap-3 bg-white py-2 sm:hidden">
						<ProductCartAndWishlistButtons />
					</div>

					<ProductMetaDataSection />
				</div>

				<ProductTags />
			</div>
		</div>
	{/if}

	<ProductReviewsSection />

	<RelatedProducts />
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
